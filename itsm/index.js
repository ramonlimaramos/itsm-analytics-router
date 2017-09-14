// itsm-analytics-router/itsm/index.js

'use strict'

const path = require('path')
const itsm = require('./worker')
const frontEndPath = { root: path.join(__dirname, '../public') }

module.exports = (app) => {
    const itsmWorker = itsm(app.get('io')) //getting socketio for every route

    // API Routes
    app.get('/api/itsm-analytics/v1/tickets', itsmWorker.ticket)
    app.post('/api/itsm-analytics/v1/tickets', itsmWorker.mergeTicket)
    app.get('/api/itsm-analytics/v1/ticket/:id', itsmWorker.ticketDetail)

    // Front-End Routes
    app.get('/itsm-analytics/', (req, res, next) => {
        res.sendFile('index.html', frontEndPath)
    })
    app.get('/itsm-analytics/service/received', (req, res, next) => {
        res.sendFile('service-received.html', frontEndPath)
    })
    app.get('/itsm-analytics/service/ongoing', (req, res, next) => {
        res.sendFile('service-ongoing.html', frontEndPath)
    })
    app.get('/itsm-analytics/service/resolved', (req, res, next) => {
        res.sendFile('service-resolved.html', frontEndPath)
    })
}