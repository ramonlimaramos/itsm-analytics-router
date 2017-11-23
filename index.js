// itsm-analytics-router/index.js

'use strict'

const app = require('./config/express')()
const mongo = require('./config/mongo')()
const http = require('http').Server(app)
//const io = require('./config/socketio')(http)
//const scheduler = require('./itsm/scheduler')(io)

http.listen(app.get('port'), () => {

    console.log('ITSM Analytics running on port', app.get('port'))
    //app.set('io', io)

    mongo.connection.once('open', () => {
        console.log('ITSM Analytics Mongo DB running on port', mongo.port)
        //scheduler.middleware() // starting scheduler data collection
        //scheduler.metrics() // starting scheduler metrics calculation
        //scheduler.sockets() // starting scheduler getter results
        //scheduler.received() // starting scheduler getter results
        //scheduler.resolved() // starting scheduler getter results
    })

    mongo.connection.on('error', (err) => {
        console.log('ITSM Analytics Mongo DB connection error', err)
    })
})