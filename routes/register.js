var express = require('express')
var router = express.Router()
var bcrypt = require('bcrypt')

const saltRounds = 10

// Register a user
router.post('/', function (req, res) {
  if (!req.body.token || !req.body.firstName || !req.body.lastName || !req.body.password) {
    res.status(400).json({ message: 'unable to add user, missing fields' })
  } else {
    var salt = bcrypt.genSaltSync(saltRounds)
    var hash = bcrypt.hashSync(req.body.password, salt)

    req.db('invites')
      .where({ token: req.body.token })
      .then(rows => {
        if (rows[0] != null) {
          req.db('users').insert(
            {
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: rows[0].email,
              password: hash,
              orgID: rows[0].orgID,
              isRegistered: true
            })
            .then(_ => {
              res.status(201).json({ message: 'User succesfully registered' })

              // Delete invite token from invites to prevent re-use of the token
              req.db('invites')
                .where({ token: req.body.token })
                .del()
                .catch(err => {
                  console.log(err)
                })
            }).catch(err => {
              res.status(400).json({ message: 'User already exists' })
              console.log(err)
            })
        } else {
          res.status(400).json({ message: 'Invalid invitation token' })
        }
      }).catch(err => {
        res.status(400).json({ message: 'Token not found' })
        console.log(err)
      })
  }
})

module.exports = router
