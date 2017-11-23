// itsm-analytics-router/itsm/index.js

'use strict'

const renderProp = require('config').EXPRESS
const path = require('path')
const itsm = require('./router')

module.exports = (app) => {
    const router = itsm(app)

    // API Routes
    app.get('/api/itsm-analytics/v1/tickets', router.ticket)
    app.post('/api/itsm-analytics/v1/tickets', router.mergeTicket)
    app.get('/api/itsm-analytics/v1/ticket/:id', router.ticketDetail)

    app.get('/api/itsm-analytics/v1/tickets/sumary', router.sumary)
    app.get('/api/itsm-analytics/v1/tickets/total/year', router.total)
    app.get('/api/itsm-analytics/v1/tickets/haeb', router.notAcceptedHaeb)
    app.get('/api/itsm-analytics/v1/tickets/delay', router.resolutionDelay)
    app.get('/api/itsm-analytics/v1/tickets/nighteen/days/delay', router.periodDelay)
    app.get('/api/itsm-analytics/v1/tickets/open', router.open)
    app.get('/api/itsm-analytics/v1/tickets/received', router.received)
    app.get('/api/itsm-analytics/v1/tickets/resolved', router.resolved)
    app.get('/api/itsm-analytics/v1/tickets/last/data/collection', router.getLastExecution)


    // Front-End Routes
    // app.get('/itsm-analytics/', (req, res, next) => {
    //     res.render('pages/index', renderProp)
    // })
    // app.get('/itsm-analytics/received', (req, res, next) => {
    //     res.render('pages/received', renderProp)
    // })
    // app.get('/itsm-analytics/resolved', (req, res, next) => {
    //     res.render('pages/resolved', renderProp)
    // })
    // app.get('/itsm-analytics/ongoing', (req, res, next) => {
    //     res.render('pages/ongoing', renderProp)
    // })
    // app.get('/itsm-analytics/ongoing/not-accepted-by-haeb', (req, res, next) => {
    //     res.render('pages/ongoing-notaccepthaeb', renderProp)
    // })
    // app.get('/itsm-analytics/ongoing/delayed-more-than-nighteen-days', (req, res, next) => {
    //     res.render('pages/ongoing-90days', renderProp)
    // })
    // app.get('/itsm-analytics/ongoing/resolution-delay', (req, res, next) => {
    //     res.render('pages/ongoing-resolutiondelay', renderProp)
    // })
    // app.get('/itsm-analytics/open', (req, res, next) => {
    //     res.render('pages/open', renderProp)
    // })
}