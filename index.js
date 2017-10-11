// itsm-analytics-router/index.js

'use strict'

const app = require('./config/express')()
const mongo = require('./config/mongo')()
const http = require('http').Server(app)
const io = require('./config/socketio')(http)
const scheduler = require('./itsm/scheduler')()

http.listen(app.get('port'), () => {
    console.log('ITSM Analytics running on port', app.get('port'))

    app.set('io', io) // setting socket to be used inside the express routes

    mongo.connection.once('open', () => {
        console.log('ITSM Analytics Mongo DB running on port', mongo.port)

        // Starting Schedulers
        scheduler.middleware() // starting scheduler data collection
        scheduler.metrics() //starting scheduler metrics calculation
    })

    mongo.connection.on('error', (err) => {
        console.log('ITSM Analytics Mongo DB connection error', err)
    })
})