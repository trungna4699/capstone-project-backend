var express = require('express')
var router = express.Router()
var tools = require('../helpers/tools.js')
var nodeMailer = require('nodemailer')
var crypto = require('crypto')

const options = require('../emailfile')
var transporter = nodeMailer.createTransport(options)

// Invite user to join speckio
router.post('/', tools.orgAdmin, function (req, res) {
  var token = crypto.randomBytes(20).toString('hex')
  var email = {
    from: '"Speckio Teams" <speckionoreply@gmail.com>', // no-reply@speckio-teams.com',
    to: 'matthewlmulheran@gmail.com',
    subject: 'Test invite',
    text: 'Invite address http://localhost/register/' + token
  }

  req.db('invites')
    .insert({
      token: token,
      email: 'matthewlmulheran@gmail.com',
      orgID: req.token.orgID
    })
    .then(_ => {
      transporter.sendMail(email, function (err, info) {
        if (err) {
          res.status(400).json({ message: 'Unable to send invite' })
          console.log(err)
        } else {
          res.status(200).json({ message: 'Email sent' })
        }
      })
    })
    .catch(err => {
      res.status(400).json({ message: 'Unable to send invite' })
      console.log(err)
    })
})

module.exports = router
