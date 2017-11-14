'use strict'

const cluster = require('cluster')

const app = require('./config/express')()
const mongo = require('./config/mongo')()
const http = require('http').Server(app)
const io = require('./config/socketio')(http)
const scheduler = require('./itsm/scheduler')()

if (cluster.isMaster) { // MASTER PROCESS

    console.log('ITSM Analytics Master Process Started .. loading cluster')

    for (let i = 0; i < 2; i++)
        cluster.fork()

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker process ${worker.process.pid} died with code: ${code} and signal: ${signal}`)
        console.log('Starting new worker')
        cluster.fork()
    })

    // Starting Schedulers
    scheduler.middleware() // starting scheduler data collection
    scheduler.metrics() //starting scheduler metrics calculation

} else { // CHILD PROCESS

    http.listen(app.get('port'), () => {
        console.log('ITSM Analytics running on port', app.get('port'))
        app.set('io', io) // setting socket to be used inside the express routes
        mongo.connection.once('open', () => {
            console.log('ITSM Analytics Mongo DB running on port', mongo.port)
        })

        mongo.connection.on('error', (err) => {
            console.log('ITSM Analytics Mongo DB connection error', err)
        })
    })
}