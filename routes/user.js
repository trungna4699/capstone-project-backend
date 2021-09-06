var express = require('express')
var router = express.Router()
const bcrypt = require('bcrypt')
var tools = require('../helpers/tools.js')

const saltRounds = 10

// Get current users data
router.get('/', function (req, res) {
  req.db.select('firstName', 'lastName', 'email')
    .from('Users')
    .where({ userID: req.token.userID })
    .then((rows) => {
      var result = rows[0]
      res.status(200).json({ user: result })
    })
    .catch((err) => {
      res.status(400).json({ message: 'User not found' })
      console.log(err)
    })
})

// Edit a user
router.patch('/', function (req, res) {
  var query = {}
  if (req.query.firstName) { query.firstName = req.query.firstName }
  if (req.query.lastName) { query.lastName = req.query.lastName }
  if (req.query.email) { query.email = req.query.email }

  req.db('Users')
    .where({ userID: req.token.userID })
    .update(query)
    .then(_ => {
      res.status(200).json({ message: 'User info updated' })
    })
    .catch((err) => {
      res.status(400).json({ message: 'No valid parameters sent' })
      console.log(err)
    })
})

// Reset current users password
router.patch('/password', function (req, res) {
  req.db('users')
    .select('userID', 'password')
    .where({ userID: req.token.userID })
    .then(rows => {
      if (bcrypt.compareSync(req.body.currentPassword, rows[0].password)) {
        var salt = bcrypt.genSaltSync(saltRounds)
        var hash = bcrypt.hashSync(req.body.newPassword, salt)
        req.db('users')
          .where({ userID: req.token.userID })
          .update({ password: hash })
          .then(_ => {
            res.status(201).json({ message: 'Password changed' })
          }).catch(err => {
            res.status(400).json({ message: 'Unable to change password' })
            console.log(err)
          })
      } else {
        res.status(401).json({ message: 'incorrect password' })
      }
    }).catch(err => {
      res.status(401).json({ message: 'Internal error' })
      console.log(err)
    })
})

// Get users teams
router.get('/team', function (req, res) {
  // Create error if user has no teams, currently returns null array
  req.db.select('TeamMembers.teamID', 'Teams.teamName', 'Teams.teamDescription',
    'Teams.teamLeaderID', 'Users.firstName', 'Users.lastName', 'hasAccepted')
    .from('TeamMembers')
    .join('Teams', 'TeamMembers.teamID', '=', 'Teams.teamID')
    .join('Users', 'Teams.teamLeaderID', '=', 'Users.userID')
    .where({ 'TeamMembers.userID': req.token.userID })
    .then((rows) => {
      if (rows[0] != null) {
        var result = []
        for (var row in rows) {
          result.push(rows[row])
        }
        res.status(200).json({ teams: result })
      } else {
        res.status(404).json({ message: 'Current user is not in any teams' })
      }
    })
    .catch((err) => {
      res.status(400).json('Teams not found')
      console.log(err)
    })
})

// Delete current user from a team
router.delete('/team', tools.teamMember, function (req, res) {
  req.db('teammembers')
    .where({
      teamID: req.query.teamID,
      userID: req.token.userID
    })
    .del()
    .then(_ => {
      res.status(200).json({ message: 'user removed from team' })
    }).catch(err => {
      res.status(400).json({ message: 'teammember not found' })
      console.log(err)
    })
})

// Current user accepts to join a team
router.patch('/join', tools.teamMember, function (req, res) {
  req.db('teammembers')
    .where({
      teamID: req.query.teamID,
      userID: req.token.userID
    })
    .update({ hasAccepted: true })
    .then(_ => {
      res.status(200).json({ message: 'user accepted team' })
    }).catch(err => {
      res.status(400).json({ message: 'teammember not found' })
      console.log(err)
    })
})

module.exports = router
