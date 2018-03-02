// itsm-analytics-router/itsm/worker

'use strict'

const wrap = require('co-express')
const co = require('co')
const moment = require('moment')
const middleware = require('../middleware')()
const ticket = require('./model')()
const validation = require('./validation')()
const worker = require('./worker')()

module.exports = (app) => {
    const controller = {}

    controller._setLastExecutionMiddleware = () => {
        return co(function*() {
            try {
                worker.setGlobalAttributes({
                    year: parseInt(moment().format('YYYY')),
                    lastUpdate: moment().format('HH:mm')
                })
            } catch (error) {
                console.log(error)
                throw error
            }
            return true
        })
    }

    controller.getLastExecution = wrap(function*(req, res, next) {
        try {
            return res.json(yield worker.getGloblaAttributes())
        } catch (error) {
            return res.status(403).json(err)
        }
    })

    controller.ticket = wrap(function*(req, res, next) {
        let result, input
        try {
            input = yield validation.isQueryValid(req.query)
            result = yield middleware.execute(input)
        } catch (err) {
            return res.status(403).json(err)
        }
        return res.json(result)
    })

    controller.ticketDetail = wrap(function*(req, res, next) {
        let result
        try {
            result = yield middleware.execute()
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
                yield controller._setLastExecutionMiddleware()
            }
        } catch (err) {
            console.log(err)
            return res.status(403).json(err)
        }
        return res.json(result)
    })

    controller.sumary = wrap(function*(req, res, next) {
        let result = {}
        try {
            result.notAcceptedHaeb = yield worker.getNotAcceptedHaeb()
            result.periodDaysDelayed = yield worker.getPeriodDaysDelayed()
            result.resolutionDelay = yield worker.getResolutionDelay()
            result.slaSatisfaction = yield worker.getSLASatisfactionTeam(true)
            result.slaAcceptence = yield worker.getSLAAcceptence()
            result.slaResolution = yield worker.getResolution()
            result.metrics = yield worker.getTotalTicketsMetrics()
        } catch (error) {
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

    controller.periodDelay = wrap(function*(req, res, next) {
        let result
        try {
            result = yield worker.getPeriodDaysDelayed()
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

    controller.received = wrap(function*(req, res, next) {
        let result
        try {
            result = yield worker.getReceived()
        } catch (err) {
            console.log(err)
            return res.status(403).json(err)
        }
        return res.json(result)
    })

    controller.resolved = wrap(function*(req, res, next) {
        let result
        try {
            result = yield worker.getResolved()
        } catch (err) {
            console.log(err)
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

    return controller
}