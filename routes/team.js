var express = require('express')
var router = express.Router()
const tools = require('../helpers/tools.js')

// Get team details
router.get('/', tools.teamMember, function (req, res) {
  req.db.select('teamID', 'Teams.teamName', 'teamDescription', 'teamLeaderID', 'firstName', 'lastName')
    .from('Teams')
    .join('Users', 'Teams.teamLeaderID', '=', 'Users.userID')
    .where({ teamID: req.query.teamID })
    .then((rows) => {
      var result = rows[0]
      res.status(200).json({ team: result })
    })
    .catch((err) => {
      res.status(400).json('Team not found')
      console.log(err)
    })
})

// Add a team
router.post('/', function (req, res) {
  req.db('Teams').insert({
    teamName: req.query.name,
    teamLeaderID: req.token.userID,
    teamDescription: req.query.desc
  }).then(_ => {
    var result
    req.db('Teams')
      .max({ teamID: 'teamID' })
      .then((rows) => {
        result = rows[0].teamID
        req.db('teammembers').insert({
          teamID: result,
          userID: req.token.userID,
          hasAccepted: true
        }).then(_ => {
          res.status(200).json({ message: 'team created', teamID: result })
        }).catch(err => {
          res.status(400).json({ message: 'unable to add teamleader to team' })
          console.log(err)
        })
      }).catch(err => {
        res.status(400).json({ message: 'unable to find teamID' })
        console.log(err)
      })
  }).catch(err => {
    res.status(400).json({ message: 'unable to add team' })
    console.log(err)
  })
})

// Edit team
router.patch('/', tools.teamLeader, function (req, res) {
  var query = {}
  if (req.query.name) { query.teamName = req.query.name }
  if (req.query.desc) { query.teamDescription = req.query.desc }

  req.db('Teams')
    .where({ teamID: req.query.teamID })
    .update(query)
    .then(_ => {
      res.status(200).json({ message: 'Team info updated' })
    })
    .catch((err) => {
      res.status(400).json({ message: 'No valid parameters sent' })
      console.log(err)
    })
})

// Delete team
router.delete('/', tools.teamLeader, function (req, res) {
  req.db('TeamMembers')
    .where({ teamID: req.query.teamID })
    .del()
    .then(_ => {
      req.db('teams')
        .where({ teamID: req.query.teamID })
        .del()
        .then(_ => {
          res.status(200).json({ message: 'Team removed' })
        })
        .catch((err) => {
          res.status(400).json('Team members not found')
          console.log(err)
        })
    })
    .catch((err) => {
      res.status(400).json('Team not found')
      console.log(err)
    })
})

// Get team overview
router.get('/overview', tools.teamMember, function (req, res) {
  req.db.select('TeamMembers.userID', 'Users.firstName', 'Users.lastName', 'Users.email',
    'EQiDescriptions.descName', 'EQiDescriptions.strengths', 'EQiDescriptions.weaknesses', 'hasAccepted')
    .from('TeamMembers')
    .join('Users', 'TeamMembers.userID', '=', 'Users.userID')
    .join('EQiResults', 'TeamMembers.userID', '=', 'EQiResults.userID')
    .join('EQiDescriptions', 'EQiResults.descID', '=', 'EQiDescriptions.descID')
    .where({ 'TeamMembers.teamID': req.query.teamID })
    .where({ 'EQiResults.categoryID': tools.randomInt(15) })
    .then((rows) => {
      var result = []
      for (var row in rows) {
        result.push(rows[row])
      }

      var subquery = req.db.select('userID').from('eqiresults')
      req.db('teammembers')
        .select('teammembers.userID', 'firstName', 'lastName', 'email', 'hasAccepted')
        .whereNotIn('teammembers.userID', subquery)
        .join('users', 'teammembers.userID', '=', 'users.userID')
        .where({ teamID: req.query.teamID })
        .then((rows) => {
          console.log(rows)
          var descriptionName
          if (result[0].descName) { descriptionName = result[0].descName } else { descriptionName = null }

          for (var row in rows) {
            var user = {
              userID: rows[row].userID,
              firstName: rows[row].firstName,
              lastName: rows[row].lastName,
              email: rows[row].email,
              descName: descriptionName,
              strengths: null,
              weaknesses: null,
              hasAccepted: rows[row].hasAccepted
            }
            result.push(user)
          }
          res.status(200).json({ overview: result })
        })
        .catch((err) => {
          res.status(400).json('Database error')
          console.log(err)
        })
    })
    .catch((err) => {
      res.status(400).json('Team not found')
      console.log(err)
    })
})

// Get team users
router.get('/user', tools.teamMember, function (req, res) {
  req.db.select('TeamMembers.userID', 'firstName', 'lastName', 'email', 'isRegistered', 'hasAccepted')
    .from('TeamMembers')
    .join('Users', 'TeamMembers.userID', '=', 'Users.userID')
    .where({ teamID: req.query.teamID })
    .then((rows) => {
      var result = []
      for (var row in rows) {
        result.push(rows[row])
      }
      res.status(200).json({ team: result })
    })
    .catch((err) => {
      res.status(400).json('Team not found')
      console.log(err)
    })
})

// Add a user to a team
router.post('/user', tools.teamLeader, function (req, res) {
  req.db.select('userID')
    .from('users')
    .where({ email: req.query.email, orgID: req.token.orgID })
    .then((rows) => {
      req.db('teammembers').insert({
        teamID: req.query.teamID,
        userID: rows[0].userID,
        hasAccepted: false
      }).then(_ => {
        res.status(201).json({ message: 'team member invited' })
      }).catch(err => {
        res.status(400).json({ message: 'unable to add to team' })
        console.log(err)
      })
    }).catch(err => {
      res.status(400).json({ message: 'email address not found' })
      console.log(err)
    })
})

// Delete a user from a team
router.delete('/user', tools.teamLeader, function (req, res) {
  req.db('teammembers')
    .where({
      teamID: req.query.teamID,
      userID: req.query.userID
    })
    .del()
    .then(_ => {
      res.status(200).json({ message: 'user removed from team' })
    }).catch(err => {
      res.status(400).json({ message: 'teammember not found' })
      console.log(err)
    })
})

module.exports = router
