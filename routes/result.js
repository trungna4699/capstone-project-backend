var express = require('express')
var router = express.Router()
const tools = require('../helpers/tools.js')

// Get EQi results for current user
router.get('/eqi', function (req, res) {
  var userID
  if (req.query.userID) { userID = req.query.userID } else { userID = req.token.userID }

  req.db.select('userID', 'EQiCategories.categoryID', 'categoryName', 'score', 'descName', 'behaviour', 'motivators', 'strengths',
    'weaknesses', 'reaction', 'communication')
    .from('EQiResults')
    .join('EQiCategories', 'EQiResults.categoryID', '=', 'EQiCategories.categoryID')
    .join('EQiDescriptions', 'EQiResults.descID', '=', 'EQiDescriptions.descID')
    .where({ userID: userID })
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

// Add eqi results for current user
router.post('/eqi', function (req, res) {
  var values = []
  // Check if results has been sent and is right length
  if (!req.body.results || req.body.results.length !== 15) { res.status(400).json({ message: 'results array not sent or incomplete' }) }

  var i
  for (i in req.body.results) {
    var result = req.body.results[i]
    // Checks if categoryID is valid
    if (result.categoryID < 1 || result.categoryID > 15) { res.status(400).json({ message: 'Invalid categoryID' }) }
    // Checks if score is valid
    var range = tools.eqiScoreRange(result.score)
    if (range === 0) { res.status(400).json({ message: 'Score not in range' }) }

    var value = {
      userID: req.token.userID,
      categoryID: result.categoryID,
      descID: ((result.categoryID * 3) - 3) + range,
      score: result.score
    }
    values.push(value)
  }

  req.db('eqiresults')
    .insert(values)
    .then(_ => {
      res.status(200).json({ message: 'results added' })
    })
    .catch((err) => {
      res.status(400).json('User results not found')
      console.log(err)
    })
})

// Edit a eqi category result for current user
router.patch('/eqi', function (req, res) {
  var values = []
  // Check if results has been sent and is right length
  if (!req.body.results) { res.status(400).json({ message: 'results array not sent' }) }

  var i
  for (i in req.body.results) {
    var result = req.body.results[i]
    // Checks if categoryID is valid
    if (result.categoryID < 1 || result.categoryID > 15) { res.status(400).json({ message: 'Invalid categoryID' }) }
    // Checks if score is valid
    var range = tools.eqiScoreRange(result.score)
    if (range === 0) { res.status(400).json({ message: 'Score not in range' }) }

    var value = {
      userID: req.token.userID,
      categoryID: result.categoryID,
      descID: ((result.categoryID * 3) - 3) + range,
      score: result.score
    }
    values.push(value)
  }

  req.db('eqiresults')
    .insert(values)
    .onDuplicateUpdate('descID', 'score')
    .then(_ => {
      res.status(200).json({ message: 'results updated' })
    })
    .catch((err) => {
      res.status(400).json('User results not found')
      console.log(err)
    })
})

// Delete eqi results for current user
router.delete('/eqi', function (req, res) {
  req.db('eqiresults')
    .where({ userID: req.token.userID })
    .del()
    .then(_ => {
      res.status(200).json({ message: 'results deleted' })
    })
    .catch((err) => {
      res.status(400).json('User results not found')
      console.log(err)
    })
})

// Get DiSC results
router.get('/disc', function (req, res) {
  var userID
  if (req.query.userID) { userID = req.query.userID } else { userID = req.token.userID }

  req.db.select('userID', 'typeName', 'behaviour', 'motivators', 'strengths',
    'weaknesses', 'reaction', 'communication')
    .from('DiscResults')
    .join('DiscTypes', 'DiscResults.typeID', '=', 'DiscTypes.typeID')
    .where({ userID: userID })
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
router.get('/team/eqi', tools.teamMember, function (req, res) {
  req.db.select('TeamMembers.userID', 'categoryName', 'score', 'descName')
    .from('TeamMembers')
    .join('EQiResults', 'TeamMembers.userID', '=', 'EQiResults.userID')
    .join('EQiCategories', 'EQiResults.categoryID', '=', 'EQiCategories.categoryID')
    .join('EQiDescriptions', 'EQiResults.descID', '=', 'EQiDescriptions.descID')
    .orderBy('TeamMembers.userID', 'EQiCategories.categoryID')
    .where({ teamID: req.query.teamID })
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

module.exports = router
