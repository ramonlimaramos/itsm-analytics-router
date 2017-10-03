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
                    .emit('ongoingSLAAcceptence', yield args.worker.getSLAAcceptence())

            } catch (error) {
                console.error(error)
            }
        })
    }

    methods.sockets = (io, wk) => {
        // Will emitt all sockets of ITSM every 1 min.
        schedule.scheduleJob('1 * * * *', methods.emitAll.bind(null, {
            io: io,
            worker: wk
        }))
    }

    methods.disableAll = () => {
        for (let sch in schedule.scheduledJobs) {
            schedule.scheduledJobs[sch].cancel()
        }
    }

    return methods
}