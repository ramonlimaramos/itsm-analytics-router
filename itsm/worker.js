// itsm-analytics-router/itsm/worker

'use strict'

const wrap = require('co-express')
const itsm = require('../middleware')()
const ticket = require('./model')()

module.exports = () => {
    const controller = {}

    controller.ticket = wrap(function*(req, res, next) {
        let result

        try {
            result = yield itsm.execute()
        } catch (err) {
            console.log(err)
            return next(err)
        }

        return res.json(result)
    })

    controller.ticketDetail = wrap(function*(req, res, next) {
        let result
            //let validator
        try {
            //validator = yield validation.isValid(req)
            result = yield itsm.execute()
        } catch (err) {
            return next(err)
        }

        return res.json(result)
    })


    controller.mergeTicket = wrap(function*(req, res, next) {
        let result

        try {
            result = yield ticket.bulkMerge(req.outData.results)
        } catch (error) {
            return next(error)
        }

        return res.json(result)
    })

    return controller
}