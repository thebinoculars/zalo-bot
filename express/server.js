'use strict'

require('dotenv').config()
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const serverless = require('serverless-http')
const cors = require('cors')

const zalo = require('./zalo')
const webhook = require('./webhook')

const app = express()
const router = express.Router()

router.post('/webhook', async (req, res) => {
  const token = req.session.token || process.env.ZALO_ACCESS_TOKEN
  const body = req.body
  const reciever = body.user_id_by_app
  if (body.event_name === 'user_send_text') {
    const key = `${body.message.text.replace('#', '')}Action`
    const action = webhook.hasOwnProperty(key) ? key : 'defaultAction'
    try {
      const data = await webhook[action](token, body)
      return res.json(data)
    } catch (err) {
      await zalo.sendTextMessage(token, reciever, 'Đã có lỗi xảy ra')
      return res.json(err)
    }
  }

  return res.json({ message: 'OK' })
})

router.get('/auth', (req, res) => {
  res.redirect(
    `https://oauth.zaloapp.com/v3/oa/permission?app_id=${process.env.APP_ID}&redirect_uri=${process.env.REDIRECT_URI}`
  )
})

router.get('/', (req, res) => {
  if (req.query.access_token) {
    req.session.token = req.query.access_token
  }
  res.writeHead(200, { 'Content-Type': 'text/html' })

  const message = req.session.token
    ? `<h1>Your access token: ${req.session.token}</h1>`
    : '<h1>Hello World</h1>'
  res.write(message)
  res.end()
})

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  session({
    secret: process.env.SECRET_KEY,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: true
  })
)
app.use('/.netlify/functions/server', router)
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')))

module.exports = app
module.exports.handler = serverless(app)
