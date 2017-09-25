// itsm-analytics-router/itsm/worker

'use strict'

const wrap = require('co-express')
const itsm = require('../middleware')()
const ticket = require('./model')()
const validation = require('./validation')()

module.exports = (io) => {
    const controller = {}

    controller.ticket = wrap(function*(req, res, next) {
        let result, input
        try {
            input = yield validation.isQueryValid(req.query)
            result = yield itsm.execute(input)
        } catch (err) {
            console.error(err)
            return res.status(403).json(err)
        }
        return res.json(result)
    })

    controller.ticketDetail = wrap(function*(req, res, next) {
        let result
        try {
            result = yield itsm.execute()
        } catch (err) {
            console.error(err)
            return res.status(403).json(err)
        }
        return res.json(result)
    })

    controller.mergeTicket = wrap(function*(req, res, next) {
        let result
        try {
            let isNull = yield validation.isNull(req.body)
            if (!isNull)
                result = yield ticket.bulkMerge(req.body.results)
        } catch (err) {
            return res.status(403).json(err)
        }
        return res.json(result)
    })

    return controller
}