var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

// Require the routes
var defaultRoute = require('./routes/default')
var registerRoute = require('./routes/register')
var loginRoute = require('./routes/login')
var userRoute = require('./routes/user')
var teamRoute = require('./routes/team')
var resultRoute = require('./routes/result')
var inviteRoute = require('./routes/invite')
var orgRoute = require('./routes/org')

// Require the helper functions
const tools = require('./helpers/tools.js')

// Knex Definitions
const options = require('./knexfile.js')
const knex = require('knex')(options)

// Adds .onDuplicateUpdate() function to knex. Required for /result/eqi PATCH route
const { attachOnDuplicateUpdate } = require('knex-on-duplicate-update')
attachOnDuplicateUpdate()

// Swagger Definitions
const swaggerui = require('swagger-ui-express')
const swaggerDocument = require('./docs/swagger.json')

// Helmet Definitions
const helmet = require('helmet')
const cors = require('cors')

var app = express()

app.use(logger('common'))
app.use(helmet())
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// logger
logger.token('req', (req, res) => JSON.stringify(req.headers))
logger.token('res', (req, res) => {
  const headers = {}
  res.getHeaderNames().map(h => headers[h] = res.getHeaders(h)) // eslint-disable-line
  return JSON.stringify(headers)
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  req.db = knex
  next()
})

// Routes
app.use('/', defaultRoute)
app.use('/register', registerRoute)
app.use('/login', loginRoute)
app.use('/user', tools.auth, userRoute)
app.use('/team', tools.auth, teamRoute)
app.use('/result', tools.auth, resultRoute)
app.use('/invite', tools.auth, inviteRoute)
app.use('/org', tools.auth, orgRoute)
app.use('/', swaggerui.serve, swaggerui.setup(swaggerDocument))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
