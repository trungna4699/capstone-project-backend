// JWT Definitions
var jwt = require('jsonwebtoken')
const fs = require('fs')
const privatekey = fs.readFileSync('./sslcert/cert.key', 'utf8')

// Checks if JWT is valid
var auth = (req, res, next) => {
  var token = req.headers.authorization
  token = token.substr(token.indexOf(' ') + 1)

  if (token) {
    jwt.verify(token, privatekey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Authentication token not valid' })
      } else {
        req.token = decoded
        next()
      }
    })
  } else {
    return res.status(401).json({ message: 'Authentication token not sent' })
  }
}

// Check if user is in team
var teamMember = (req, res, next) => {
  req.db('TeamMembers')
    .where({ userID: req.token.userID, teamID: req.query.teamID })
    .then((rows) => {
      if (rows[0] != null) {
        next()
      } else {
        res.status(403).json({ message: 'User not in team' })
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(403).json({ message: 'User not in team' })
    })
}

// Check if user is team leader
var teamLeader = (req, res, next) => {
  req.db('Teams')
    .where({ teamID: req.query.teamID, teamLeaderID: req.token.userID })
    .then((rows) => {
      if (rows[0] != null) {
        next()
      } else {
        res.status(403).json({ message: 'User is not the team leader' })
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(403).json({ message: 'User is not the team leader' })
    })
}

// Check if user is org admin
var orgAdmin = (req, res, next) => {
  req.db('admins')
    .where({ orgID: req.token.orgID, userID: req.token.userID })
    .then((rows) => {
      if (rows[0] != null) {
        next()
      } else {
        res.status(403).json({ message: 'User is not an administrator' })
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(403).json({ message: 'User is not an administrator' })
    })
}

// Check if an admin can be removed, an org must have at least one admin
var orgAdminCount = (req, res, next) => {
  req.db('admins')
    .count('userID as count')
    .where({ orgID: req.token.orgID })
    .then(rows => {
      if (rows[0].count >= 2) {
        next()
      } else {
        res.status(403).json({ message: 'Too few administrators to remove one' })
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(403).json({ message: 'Unable to remove admin' })
    })
}

// Returns random int between 1 and max inclusive
var randomInt = function (max) {
  return Math.floor(Math.random() * Math.floor(max)) + 1
}

// EQi score to range conversion
var eqiScoreRange = function (score) {
  if (score >= 70 && score < 90) { return 1 } else if (score >= 90 && score <= 110) { return 2 } else if (score > 110 && score <= 130) { return 3 } else { return 0 }
}

module.exports = {
  auth,
  teamMember,
  teamLeader,
  orgAdmin,
  orgAdminCount,
  randomInt,
  eqiScoreRange
}
