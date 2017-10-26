'use strict'

const schedule = require('node-schedule')
const co = require('co')
const moment = require('moment')
const middleware = require('../middleware')()
const worker = require('./worker')()
const config = require('config').ITSM

module.exports = () => {
    const methods = {}

    methods.emitAll = (args) => {
        return co(function*() {
            try {
                // Resolved Invokers
                args.io.of('resolved')
                    .emit('resolvedAvgTimeResolution', yield worker.getResolvedAvgTimeResolution())
                args.io.of('resolved')
                    .emit('resolvedQtdTimeResolution', yield worker.getResolvedQtdTimeResolution())

                // Received Invokers
                args.io.of('received')
                    .emit('receivedReceivedAndApprovedTeam', yield worker.getReceivedAndApprovedTeam())
                args.io.of('received')
                    .emit('receivedGranTotal', yield worker.getGranTotal())
                args.io.of('received')
                    .emit('receivedReceivedAndApprovedDept', yield worker.getReceivedAndApprovedDept())

                // Ongoing Invokers
                args.io.of('ongoing')
                    .emit('ongoingNotAcceptedHaeb', yield worker.getNotAcceptedHaeb())
                args.io.of('ongoing')
                    .emit('ongoingPeriodDaysDelayed', yield worker.getPeriodDaysDelayed())
                args.io.of('ongoing')
                    .emit('ongoingResolutionDelay', yield worker.getResolutionDelay())
                args.io.of('ongoing')
                    .emit('ongoingSLASatisfactionTeam', yield worker.getSLASatisfactionTeam())
                args.io.of('ongoing')
                    .emit('ongoingSLASatisfaction', yield worker.getSLASatisfactionTeam(true))
                args.io.of('ongoing')
                    .emit('ongoingSLAAcceptence', yield worker.getSLAAcceptence())
                args.io.of('ongoing')
                    .emit('ongoingResolution', yield worker.getResolution())
                args.io.of('ongoing')
                    .emit('ongoingTotalMetrics', yield worker.getTotalTicketsMetrics())
            } catch (error) {
                console.error(error)
            }
            return true
        })
    }

    methods.getData = () => {
        return co(function*() {
            let STARTDATE,
                ENDDATE,
                timeOccur
            try {
                STARTDATE = moment().subtract(1, 'y').format('YYYY-MM-DD')
                ENDDATE = moment().add(1, 'd').format('YYYY-MM-DD')
                timeOccur = moment().format('YYYY-MM-DD hh:mm')

                console.log('ITSM Analytics requesting EAI', STARTDATE, ENDDATE, timeOccur)

                yield middleware.execute({
                    INVOKE: 'async',
                    STARTDATE: STARTDATE,
                    ENDDATE: ENDDATE
                })
            } catch (error) {
                console.error(error)
                throw error
            }
            return true
        })
    }

    methods.sockets = (io, wk) => {
        // Will emitt all sockets of ITSM
        console.log("ITSM Analytics starging sockets scheduler")
        let rule = new schedule.RecurrenceRule();
        rule.second = new schedule.Range(0, 59, config.sch_sockets.sec)
        schedule.scheduleJob(rule, methods.emitAll.bind(null, {
            io: io
        }))
    }

    methods.middleware = () => {
        // Will get data from EAI
        console.log("ITSM Analytics starging middleware scheduler collection")
        let rule = new schedule.RecurrenceRule();
        rule.minute = new schedule.Range(0, 59, config.sch_eai.min)
        schedule.scheduleJob(rule, methods.getData)
    }

    methods.metrics = () => {
        // Will calculate the metrics by year
        console.log("ITSM Analytics starging metrics scheduler")
        let rule = new schedule.RecurrenceRule();
        rule.second = new schedule.Range(0, 59, config.sch_metrics.sec)
        schedule.scheduleJob(rule, () => {
            return co(function*() {
                try {
                    yield worker.setTotalTicketsMetrics()
                } catch (error) {
                    console.log(error)
                    throw error
                }
                return true
            })
        })
    }

    methods.disableAll = () => {
        for (let sch in schedule.scheduledJobs) {
            schedule.scheduledJobs[sch].cancel()
        }
    }

    return methods
}