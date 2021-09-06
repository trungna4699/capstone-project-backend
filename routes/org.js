var express = require('express')
var router = express.Router()
var tools = require('../helpers/tools.js')

// Get organisation name and tier and license number
router.get('/', function (req, res) {
  req.db.select('orgName')
    .from('organisations')
    .where({ orgID: req.token.orgID })
    .then((rows) => {
      var result = rows[0]
      res.status(200).json({ Organisation: result.orgName })
    })
    .catch((err) => {
      res.status(400).json({ message: 'Organisation not found' })
      console.log(err)
    })
})

// Get all organisation admins
router.get('/admin', tools.orgAdmin, function (req, res) {
  req.db.select('admins.userID', 'firstName', 'lastName', 'email')
    .from('admins')
    .join('users', 'admins.userID', '=', 'users.userID')
    .where('admins.orgID', req.token.orgID)
    .then(rows => {
      var result = []
      for (var row in rows) {
        result.push(rows[row])
      }
      res.status(200).json({ admins: result })
    })
    .catch((err) => {
      res.status(400).json('Admins not found')
      console.log(err)
    })
})

// Add a user to organisation admins
router.post('/admin', tools.orgAdmin, function (req, res) {
  req.db('admins')
    .insert({ orgID: req.token.orgID, userID: req.query.userID })
    .then(_ => {
      res.status(200).json({ message: 'user added to admins' })
    }).catch(err => {
      res.status(400).json({ message: 'unable to add user to admins' })
      console.log(err)
    })
})

// Delete an organisation admin
router.delete('/admin', tools.orgAdmin, tools.orgAdminCount, function (req, res) {
  req.db('admins')
    .where({ orgID: req.token.orgID, userID: req.query.userID })
    .del()
    .then(_ => {
      res.status(200).json({ message: 'User removed from admins' })
    })
    .catch((err) => {
      res.status(400).json({ message: 'Unable to remove user from admins' })
      console.log(err)
    })
})

module.exports = router
