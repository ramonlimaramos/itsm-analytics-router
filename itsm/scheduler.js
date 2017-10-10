'use strict'

const schedule = require('node-schedule')
const co = require('co')

module.exports = () => {
    const methods = {}

    methods.emitAll = (args) => {
        return co(function*() {
            try {
                // Received Invokers
                args.io.of('received')
                    .emit('receivedReceivedAndApprovedTeam', yield args.worker.getReceivedAndApprovedTeam())
                args.io.of('received')
                    .emit('receivedGranTotal', yield args.worker.getGranTotal())
                args.io.of('received')
                    .emit('receivedReceivedAndApprovedDept', yield args.worker.getReceivedAndApprovedDept())

                // Ongoing Invokers
                args.io.of('ongoing')
                    .emit('ongoingNotAcceptedHaeb', yield args.worker.getNotAcceptedHaeb())
                args.io.of('ongoing')
                    .emit('ongoingPeriodDaysDelayed', yield args.worker.getPeriodDaysDelayed())
                args.io.of('ongoing')
                    .emit('ongoingResolutionDelay', yield args.worker.getResolutionDelay())
                args.io.of('ongoing')
                    .emit('ongoingSLASatisfactionTeam', yield args.worker.getSLASatisfactionTeam())
                args.io.of('ongoing')
                    .emit('ongoingSLASatisfaction', yield args.worker.getSLASatisfactionTeam(true))
                args.io.of('ongoing')
                    .emit('ongoingSLAAcceptence', yield args.worker.getSLAAcceptence())
                args.io.of('ongoing')
                    .emit('ongoingResolution', yield args.worker.getResolution())
                args.io.of('ongoing')
                    .emit('ongoingTotalMetrics', yield args.worker.totalTicketsMetrics())
            } catch (error) {
                console.error(error)
            }
            return true
        })
    }

    methods.sockets = (io, wk) => {
        // Will emitt all sockets of ITSM every 1 min.
        schedule.scheduleJob('5 * * * * *', methods.emitAll.bind(null, {
            io: io,
            worker: wk
        }))
    }

    methods.middleware = () => {
        // scheduler that will collect the data from ITSM
    }

    methods.disableAll = () => {
        for (let sch in schedule.scheduledJobs) {
            schedule.scheduledJobs[sch].cancel()
        }
    }

    return methods
}