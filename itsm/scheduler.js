'use strict'

const schedule = require('node-schedule')
const co = require('co')

module.exports = () => {
    const methods = {}

    methods.emitAll = (args) => {
        return co(function*() {
            let result
            try {
                // Received Invokers
                result = yield args.worker.getReceivedAndApprovedTeam()
                args.socket.emit('receivedAndApprovedResponse', result)

                result = yield args.worker.getGranTotal()
                args.socket.emit('granTotalResponse', result)

                // Ongoing Invokers
                result = yield args.worker.getNotAcceptedHaeb()
                args.socket.emit('ongoingNotAcceptedHaebResponse', result)

                result = yield args.worker.getPeriodDaysDelayed()
                args.socket.emit('ongoingPeriodDaysDelayedResponse', result)

                result = yield args.worker.getResolutionDelay()
                args.socket.emit('ongoingResolutionDelayResponse', result)

                result = yield args.worker.getSLASatisfactionTeam()
                args.socket.emit('ongoingSLASatisfactionTeamResponse', result)
            } catch (error) {
                console.log(error)
            }
        })
    }

    methods.sockets = (io, wk) => {
        // Will emitt all sockets of ITSM every 20 sec.
        let rule = new schedule.RecurrenceRule()
        rule.second = 20

        let bindOjb = { socket: io, worker: wk }
        schedule.scheduleJob(rule, methods.emitAll.bind(null, bindOjb))
    }

    return methods
}