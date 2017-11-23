'use strict'

const schedule = require('node-schedule')
const co = require('co')
const moment = require('moment')
const middleware = require('../middleware')()
const worker = require('./worker')()
const config = require('config').ITSM

module.exports = (io) => {
    const methods = {}

    methods.emitAll = () => {
        return co(function*() {
            try {
                // Resolved Invokers
                io.sockets
                    .emit('resolved', yield worker.getResolved())

                // Received Invokers
                io.sockets
                    .emit('received', yield worker.getReceived())

                // Ongoing Invokers
                io.sockets
                    .emit('ongoingNotAcceptedHaeb', yield worker.getNotAcceptedHaeb())
                io.sockets
                    .emit('ongoingPeriodDaysDelayed', yield worker.getPeriodDaysDelayed())
                io.sockets
                    .emit('ongoingResolutionDelay', yield worker.getResolutionDelay())
                io.sockets
                    .emit('ongoingSLASatisfactionTeam', yield worker.getSLASatisfactionTeam())
                io.sockets
                    .emit('ongoingSLASatisfaction', yield worker.getSLASatisfactionTeam(true))
                io.sockets
                    .emit('ongoingSLAAcceptence', yield worker.getSLAAcceptence())
                io.sockets
                    .emit('ongoingResolution', yield worker.getResolution())
                io.sockets
                    .emit('ongoingTotalMetrics', yield worker.getTotalTicketsMetrics())
                
                // Last Execution Emittion
                io.sockets
                    .emit('lastExecutionMiddleware', yield worker.getGloblaAttributes())
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

    methods.sockets = () => {
        // Will emitt all sockets of ITSM
        console.log("ITSM Analytics starging sockets scheduler")
        let rule = new schedule.RecurrenceRule();
        rule.minute = new schedule.Range(0, 59, config.sch_sockets.min)
        schedule.scheduleJob(rule, methods.emitAll)
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

    methods.received = () => {
        // Will calculate the received by year
        console.log("ITSM Analytics starging received scheduler")
        let rule = new schedule.RecurrenceRule();
        rule.hour = new schedule.Range(0, 59, config.sch_received.hour)
        schedule.scheduleJob(rule, () => {
            return co(function*() {
                try {
                    yield worker.setReceived()
                } catch (error) {
                    console.log(error)
                    throw error
                }
                return true
            })
        })
    }

    methods.resolved = () => {
        // Will calculate the resolved by year
        console.log("ITSM Analytics starging resolved scheduler")
        let rule = new schedule.RecurrenceRule();
        rule.hour = new schedule.Range(0, 59, config.sch_resolved.hour)
        schedule.scheduleJob(rule, () => {
            return co(function*() {
                try {
                    yield worker.setResolved()
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