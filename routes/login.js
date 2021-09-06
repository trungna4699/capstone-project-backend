var express = require('express')
var router = express.Router()
var jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const fs = require('fs')
const privatekey = fs.readFileSync('./sslcert/cert.key', 'utf8')

// Login a user
router.post('/', function (req, res) {
  if (!req.body.email || !req.body.password) {
    res.status(401).json({ message: 'invalid login - you need to supply both an email and password' })
  } else {
    req.db('users')
      .select('userID', 'password', 'email', 'orgID')
      .where({ email: req.body.email })
      .then(hash => {
        if (bcrypt.compareSync(req.body.password, hash[0].password)) {
          var token = jwt.sign({ email: hash[0].email, userID: hash[0].userID, orgID: hash[0].orgID }, privatekey, { expiresIn: 86400 })
          res.status(200).json({ token: token, token_type: 'Bearer', expires_in: 86400, userID: hash[0].userID })
        } else {
          res.status(401).json({ message: 'incorrect password' })
        }
      }).catch(err => {
        res.status(401).json({ message: 'User does not exist' })
        console.log(err)
      })
  }
})

module.exports = router
