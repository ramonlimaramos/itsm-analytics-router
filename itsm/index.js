// itsm-analytics-router/itsm/index.js

'use strict'

const path = require('path')
const itsm = require('./router')

module.exports = (app) => {
    const router = itsm(app)

    // API Routes
    app.get('/api/itsm-analytics/v1/tickets', router.ticket)
    app.post('/api/itsm-analytics/v1/tickets', router.mergeTicket)
    app.get('/api/itsm-analytics/v1/ticket/:id', router.ticketDetail)

    app.get('/api/itsm-analytics/v1/tickets/total/year', router.total)
    app.get('/api/itsm-analytics/v1/tickets/haeb', router.notAcceptedHaeb)
    app.get('/api/itsm-analytics/v1/tickets/delay', router.resolutionDelay)
    app.get('/api/itsm-analytics/v1/tickets/open', router.open)

    // Front-End Routes
    app.get('/itsm-analytics/', (req, res, next) => {
        res.render('pages/index', { cache: 'pages/index' })
    })
    app.get('/itsm-analytics/received', (req, res, next) => {
        res.render('pages/received', { cache: 'pages/received' })
    })
    app.get('/itsm-analytics/ongoing', (req, res, next) => {
        res.render('pages/ongoing', { cache: 'pages/ongoing' })
    })
    app.get('/itsm-analytics/ongoing/not-accepted-by-haeb', (req, res, next) => {
        res.render('pages/ongoing-notaccepthaeb', { cache: 'pages/ongoing-notaccepthaeb' })
    })
    app.get('/itsm-analytics/ongoing/delayed-more-than-nighteen-days', (req, res, next) => {
        res.render('pages/ongoing-90days', { cache: 'pages/ongoing-90days' })
    })
    app.get('/itsm-analytics/ongoing/resolution-delay', (req, res, next) => {
        res.render('pages/ongoing-resolutiondelay', { cache: 'pages/ongoing-resolutiondelay' })
    })
    app.get('/itsm-analytics/resolved', (req, res, next) => {
        res.render('pages/resolved', { cache: 'pages/resolved' })
    })
    app.get('/itsm-analytics/open', (req, res, next) => {
        res.render('pages/open', { cache: 'pages/open' })
    })
}