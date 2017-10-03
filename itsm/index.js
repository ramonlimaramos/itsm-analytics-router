// itsm-analytics-router/itsm/index.js

'use strict'

const path = require('path')
const itsm = require('./router')

module.exports = (app) => {
    const router = itsm(app.get('io')) //setting socketio for every route

    // API Routes
    app.get('/api/itsm-analytics/v1/tickets', router.ticket)
    app.post('/api/itsm-analytics/v1/tickets', router.mergeTicket)
    app.get('/api/itsm-analytics/v1/ticket/:id', router.ticketDetail)

    // Front-End Routes
    app.get('/itsm-analytics/', (req, res, next) => {
        res.render('pages/index')
    })
    app.get('/itsm-analytics/received', (req, res, next) => {
        res.render('pages/index')
    })
    app.get('/itsm-analytics/ongoing', (req, res, next) => {
        res.render('pages/ongoing')
    })
    app.get('/itsm-analytics/ongoing/not-accepted-by-haeb', (req, res, next) => {
        res.render('pages/ongoing-notaccepthaeb')
    })
    app.get('/itsm-analytics/ongoing/delayed-more-than-nighteen-days', (req, res, next) => {
        res.render('pages/ongoing-90days')
    })
    app.get('/itsm-analytics/ongoing/resolution-delay', (req, res, next) => {
        res.render('pages/ongoing-resolutiondelay')
    })
    app.get('/itsm-analytics/resolved', (req, res, next) => {
        res.render('pages/resolved')
    })
}