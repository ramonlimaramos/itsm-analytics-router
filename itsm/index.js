// itsm-analytics-router/itsm/index.js

'use strict'

const path = require('path')

const itsmWorker = require('./worker')()

module.exports = (app) => {
    // API Routes
    app.get('/api/itsm-analytics/v1/tickets', itsmWorker.ticket)
    app.post('/api/itsm-analytics/v1/tickets', itsmWorker.mergeTicket)
    app.get('/api/itsm-analytics/v1/ticket/:status', itsmWorker.ticketDetail)

    // Front-End Routes
    app.get('/itsm-analytics/', (req, res, next) => {
        res.sendFile('index.html', { root: path.join(__dirname, '../public') })
    })
    app.get('/itsm-analytics/service/received', (req, res, next) => {
        res.sendFile('service-received.html', { root: path.join(__dirname, '../public') })
    })
    app.get('/itsm-analytics/service/ongoing', (req, res, next) => {
        res.sendFile('service-ongoing.html', { root: path.join(__dirname, '../public') })
    })
    app.get('/itsm-analytics/service/resolved', (req, res, next) => {
        res.sendFile('service-resolved.html', { root: path.join(__dirname, '../public') })
    })

}