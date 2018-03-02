'use strict'

const moment = require('moment')
const util = require('util')
const worker = require('./worker')()
const scheduler = require('./scheduler')()
const co = require('co')

module.exports = (io) => {

    // Emitting data for sockets on ONGOING RULE
    const ongoing = io.of('/ongoing')
    ongoing.on('connection', socket => {
        console.log(`ITSM Analytics host-client ${socket.request.socket.remoteAddress} connected ongoing`)
        co(function*() {
            try {
                ongoing.volatile.emit('ongoingTotalMetrics', yield worker.getTotalTicketsMetrics())
                ongoing.volatile.emit('ongoingNotAcceptedHaeb', yield worker.getNotAcceptedHaeb())
                ongoing.volatile.emit('ongoingPeriodDaysDelayed', yield worker.getPeriodDaysDelayed())
                ongoing.volatile.emit('ongoingResolutionDelay', yield worker.getResolutionDelay())
                ongoing.volatile.emit('ongoingSLASatisfactionTeam', yield worker.getSLASatisfactionTeam())
                ongoing.volatile.emit('ongoingSLAAcceptence', yield worker.getSLAAcceptence())
                ongoing.volatile.emit('ongoingSLASatisfaction', yield worker.getSLASatisfactionTeam(true))
                ongoing.volatile.emit('ongoingResolution', yield worker.getResolution())
            } catch (error) {
                console.error(error)
            }
        })
        socket.on('disconnect', () => {
            console.log(`ITSM Analytics host-client ${socket.request.socket.remoteAddress} disconnected from ongoing`)
        })
    })

    // Emitting data for sockets on RECEIVED RULE
    const received = io.of('/received')
    received.on('connection', socket => {
        console.log(`ITSM Analytics host-client ${socket.request.socket.remoteAddress} connected received`)
        co(function*() {
            try {
                received.volatile
                    .emit('receivedReceivedAndApprovedTeam', yield worker.getReceivedAndApprovedTeam())
                received.volatile
                    .emit('receivedGranTotal', yield worker.getGranTotal())
                received
                    .emit('receivedReceivedAndApprovedDept', yield worker.getReceivedAndApprovedDept())
            } catch (error) {
                console.error(error)
            }
        })
        socket.on('disconnect', () => {
            console.log(`ITSM Analytics host-client ${socket.request.socket.remoteAddress} disconnected from received`)
        })
    })

    // Emitting data for sockets on RESOLVED RULE
    const resolved = io.of('/resolved')
    resolved.on('connection', socket => {
        console.log(`ITSM Analytics host-client ${socket.request.socket.remoteAddress} connected resolved`)
        co(function*() {
            try {
                resolved.volatile
                    .emit('resolvedAvgTimeResolution', yield worker.getResolvedAvgTimeResolution())
                resolved.volatile
                    .emit('resolvedQtdTimeResolution', yield worker.getResolvedQtdTimeResolution())
            } catch (error) {
                console.error(error)
            }
        })
        socket.on('disconnect', () => {
            console.log(`ITSM Analytics host-client ${socket.request.socket.remoteAddress} disconnected from resolved`)
        })
    })

    // Starting Emittion Scheduler for each socket
    scheduler.sockets(io, worker)
}