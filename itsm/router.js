// itsm-analytics-router/itsm/worker

'use strict'

const wrap = require('co-express')
const co = require('co')
const moment = require('moment')
const itsm = require('../middleware')()
const ticket = require('./model')()
const validation = require('./validation')()
const worker = require('./worker')()

module.exports = (app) => {
    const controller = {}

    controller._emitLastExecutionMiddleware = () => {
        return co(function*() {
            try {
                let m = moment().format('HH:mm')
                app.get('io').of('ongoing').emit('lastExecutionMiddleware', m)
                app.get('io').of('received').emit('lastExecutionMiddleware', m)
                app.get('io').of('resolved').emit('lastExecutionMiddleware', m)
            } catch (error) {
                console.log(error)
                throw error
            }
            return true
        })
    }

    controller.ticket = wrap(function*(req, res, next) {
        let result, input
        try {
            input = yield validation.isQueryValid(req.query)
            result = yield itsm.execute(input)
        } catch (err) {
            return res.status(403).json(err)
        }
        return res.json(result)
    })

    controller.ticketDetail = wrap(function*(req, res, next) {
        let result
        try {
            result = yield itsm.execute()
        } catch (err) {
            return res.status(403).json(err)
        }
        return res.json(result)
    })

    controller.mergeTicket = wrap(function*(req, res, next) {
        let result
        console.log(`############## received data from EAI - ${moment().format('HH:mm:ss')}`)
        try {
            let isNull = yield validation.isNull(req.body)
            if (!isNull) {
                result = yield ticket.bulkMerge(req.body.results)
                yield controller._emitLastExecutionMiddleware()
            }
        } catch (err) {
            console.log(err)
            return res.status(403).json(err)
        }
        return res.json(result)
    })

    controller.total = wrap(function*(req, res, next) {
        let result
        try {
            result = yield worker.totalTicketsMetrics()
        } catch (error) {
            return res.status(403).json(err)
        }
        return res.json(result)
    })

    controller.resolutionDelay = wrap(function*(req, res, next) {
        let result
        try {
            result = yield worker.getResolutionDelay()
        } catch (error) {
            return res.status(403).json(err)
        }
        return res.json(result)
    })

    controller.notAcceptedHaeb = wrap(function*(req, res, next) {
        let result
        try {
            result = yield worker.getNotAcceptedHaeb()
        } catch (error) {
            return res.status(403).json(err)
        }
        return res.json(result)
    })

    controller.periodDaysDelayed = wrap(function*(req, res, next) {
        let result
        try {
            result = yield worker.getPeriodDaysDelayed()
        } catch (error) {
            return res.status(403).json(err)
        }
        return res.json(result)
    })

    controller.open = wrap(function*(req, res, next) {
        let result
        try {
            result = yield worker.getOpenTickets(req.query)
        } catch (error) {
            return res.status(403).json(err)
        }
        return res.json(result)
    })

    controller.render = wrap(function*(req, res, next) {})

    return controller
}