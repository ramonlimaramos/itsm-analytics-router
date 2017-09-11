// itsm-analytics-router/index.js

'use strict'

const http = require('http')
const mongo = require('./config/mongo')()
const app = require('./config/express')()

mongo.connection.once('open', () => {
    console.log('ITSM Analytics Mongo DB running on port', mongo.port)
    console.log('ITSM Analytics Schedulers Started ...')
    http.createServer(app).listen(app.get('port'), () => {
        console.log('ITSM Analytics running on port', app.get('port'))
    })
})
mongo.connection.on('error', (err) => {
    console.log('ITSM Analytics Mongo DB connection error', err)
})