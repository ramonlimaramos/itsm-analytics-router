// itsm-analytics-router/index.js

'use strict'

const app = require('./config/express')()
const mongo = require('./config/mongo')()
const http = require('http').Server(app)
const io = require('./config/socketio')(http)

http.listen(app.get('port'), () => {
    console.log('ITSM Analytics running on port', app.get('port'))

    app.set('io', io) // setting socket to be used inside the routes

    mongo.connection.once('open', () => {
        console.log('ITSM Analytics Mongo DB running on port', mongo.port)
    })

    mongo.connection.on('error', (err) => {
        console.log('ITSM Analytics Mongo DB connection error', err)
    })
})