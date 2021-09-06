var express = require('express')
var router = express.Router()

// Returns random int between 1 and max inclusive
function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max)) + 1
}

// Get team details
router.get('/getteam', function (req, res) {
  // add check if team ID is valid
  req.db.select('teamID', 'Teams.teamName', 'teamDescription', 'teamLeaderID', 'firstName', 'lastName')
    .from('Teams')
    .join('Users', 'Teams.teamLeaderID', '=', 'Users.userID')
    .where({ teamID: req.query.teamid })
    .then((rows) => {
      var result = rows[0]
      console.log(rows[0].teamName)
      res.status(200).json({ team: result })
    })
    .catch((err) => {
      res.status(400).json('Team not found')
      console.log(err)
    })
})

// Delete a team
router.delete('/deleteteam', function (req, res) {
  req.db('TeamMembers')
    .where({ teamID: req.query.teamid })
    .del()
    .then(_ => {
      req.db('teams')
        .where({ teamID: req.query.teamid })
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

// Get strengths and weakness of users in a team
router.get('/getteamoverview', function (req, res) {
  // add checks
  req.db.select('TeamMembers.userID', 'Users.firstName', 'Users.lastName', 'Users.email',
    'EQiDescriptions.descName', 'EQiDescriptions.strengths', 'EQiDescriptions.weaknesses', 'hasAccepted')
    .from('TeamMembers')
    .join('Users', 'TeamMembers.userID', '=', 'Users.userID')
    .join('EQiResults', 'TeamMembers.userID', '=', 'EQiResults.userID')
    .join('EQiDescriptions', 'EQiResults.descID', '=', 'EQiDescriptions.descID')
    .where({ 'TeamMembers.teamID': req.query.teamid })
    .where({ 'EQiResults.categoryID': getRandomInt(15) })
    .then((rows) => {
      var result = []
      for (var row in rows) {
        result.push(rows[row])
      }

      var subquery = req.db.select('userID').from('eqiresults')
      req.db('teammembers')
        .whereNotIn('userID', subquery)
        .select('userID')
        .then((rows) => {
          var users = []
          for (var row in rows) {
            users.push(rows[row].userID)
          }

          if (users[0] != null) {
            res.status(200).json({ 'Users without results': users, overview: result })
          } else {
            res.status(200).json({ overview: result })
          }
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
router.get('/getteamusers', function (req, res) {
  // add check if team ID is valid
  req.db.select('TeamMembers.userID', 'firstname', 'lastname', 'email', 'isRegistered', 'hasAccepted')
    .from('TeamMembers')
    .join('Users', 'TeamMembers.userID', '=', 'Users.userID')
    .where({ teamID: req.query.teamid })
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

// Get user
router.get('/getuser', function (req, res) {
  req.db.select('firstname', 'lastname', 'email')
    .from('Users')
    .where({ userID: req.query.userID })
    .then((rows) => {
      var result = rows[0]
      res.status(200).json({ user: result })
    })
    .catch((err) => {
      res.status(400).json('User not found')
      console.log(err)
    })
})

// Get users teams
router.get('/getusersteams', function (req, res) {
  // add check if userID belongs to user
  // will use token to check user at later date

  // Create error if user has no teams, currently returns null array
  req.db.select('TeamMembers.teamID', 'Teams.teamName', 'Teams.teamDescription',
    'Teams.teamLeaderID', 'Users.firstName', 'Users.lastName', 'hasAccepted')
    .from('TeamMembers')
    .join('Teams', 'TeamMembers.teamID', '=', 'Teams.teamID')
    .join('Users', 'Teams.teamLeaderID', '=', 'Users.userID')
    .where({ 'TeamMembers.userID': req.query.userID })
    .then((rows) => {
      var result = []
      for (var row in rows) {
        result.push(rows[row])
      }
      res.status(200).json({ teams: result })
    })
    .catch((err) => {
      res.status(400).json('Teams not found')
      console.log(err)
    })
})

// Get DiSC results
router.get('/getDiscresults', function (req, res) {
  // add check if requesting user has access to user results
  req.db.select('userID', 'typeName', 'behaviour', 'motivators', 'strengths',
    'weaknesses', 'reaction', 'communication')
    .from('DiscResults')
    .join('DiscTypes', 'DiscResults.typeID', '=', 'DiscTypes.typeID')
    .where({ userID: req.query.userID })
    .then((rows) => {
      var result = []
      for (var row in rows) {
        result.push(rows[row])
      }
      res.status(200).json({ results: result })
    })
    .catch((err) => {
      res.status(400).json('User results not found')
      console.log(err)
    })
})

// Get EQi results
router.get('/getEQiresults', function (req, res) {
  // add check if requesting user has access to user results
  req.db.select('userID', 'categoryName', 'score', 'descName', 'behaviour', 'motivators', 'strengths',
    'weaknesses', 'reaction', 'communication')
    .from('EQiResults')
    .join('EQiCategories', 'EQiResults.categoryID', '=', 'EQiCategories.categoryID')
    .join('EQiDescriptions', 'EQiResults.descID', '=', 'EQiDescriptions.descID')
    .where({ userID: req.query.userID })
    .then((rows) => {
      var result = []
      for (var row in rows) {
        result.push(rows[row])
      }
      res.status(200).json({ results: result })
    })
    .catch((err) => {
      res.status(400).json('User results not found')
      console.log(err)
    })
})

// Get team EQi results
router.get('/getteamEQiresults', function (req, res) {
  // add check if requesting user has access to user results
  req.db.select('TeamMembers.userID', 'categoryName', 'score', 'descName')
    .from('TeamMembers')
    .join('EQiResults', 'TeamMembers.userID', '=', 'EQiResults.userID')
    .join('EQiCategories', 'EQiResults.categoryID', '=', 'EQiCategories.categoryID')
    .join('EQiDescriptions', 'EQiResults.descID', '=', 'EQiDescriptions.descID')
    .orderBy('TeamMembers.userID', 'EQiCategories.categoryID')
    .where({ teamID: req.query.teamid })
    .then((rows) => {
      var result = []
      for (var row in rows) {
        result.push(rows[row])
      }
      res.status(200).json({ results: result })
    })
    .catch((err) => {
      res.status(400).json('Team results not found')
      console.log(err)
    })
})

// Add team
router.post('/addteam', function (req, res) {
  req.db('Teams').insert({
    teamName: req.query.name,
    teamLeaderID: req.query.leader,
    teamDescription: req.query.desc
  }).then(_ => {
    var result
    req.db('Teams')
      .max({ teamID: 'teamID' })
      .then((rows) => {
        result = rows[0].teamID
        console.log(result)
        req.db('teammembers').insert({
          teamID: result,
          userID: req.query.leader,
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

// Add a user to a team
router.post('/addusertoteam', function (req, res) {
  var ID

  // finds user by email, returns error if user not found
  req.db.select('userID')
    .from('users')
    .where('email', req.query.email)
    .then((rows) => {
      ID = rows[0].userID

      // inserts user into teammembers with teamID
      req.db('teammembers').insert({
        teamID: req.query.teamID,
        userID: ID,
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
router.delete('/removeuserfromteam', function (req, res) {
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
