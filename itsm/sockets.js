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
                ongoing.emit('ongoingTotalMetrics', yield worker.getTotalTicketsMetrics())
                ongoing.emit('ongoingNotAcceptedHaeb', yield worker.getNotAcceptedHaeb())
                ongoing.emit('ongoingPeriodDaysDelayed', yield worker.getPeriodDaysDelayed())
                ongoing.emit('ongoingResolutionDelay', yield worker.getResolutionDelay())
                ongoing.emit('ongoingSLASatisfactionTeam', yield worker.getSLASatisfactionTeam())
                ongoing.emit('ongoingSLAAcceptence', yield worker.getSLAAcceptence())
                ongoing.emit('ongoingSLASatisfaction', yield worker.getSLASatisfactionTeam(true))
                ongoing.emit('ongoingResolution', yield worker.getResolution())
            } catch (error) {
                console.error(error)
            }
        })
        socket.on('disconnect', () => {
            console.log(`ITSM Analytics host-client ${socket.request.socket.remoteAddress} disconnected from ongoing`)
        })
    })

    // Emitting data for sockets on RECEIVED RULE
    /*const received = io.of('/received')
    received.on('connection', socket => {
        console.log(`ITSM Analytics host-client ${socket.request.socket.remoteAddress} connected received`)
        co(function*() {
            try {
                received
                    .emit('receivedReceivedAndApprovedTeam', yield worker.getReceivedAndApprovedTeam())
                received
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
    })*/

    // Starting Emittion Scheduler for each socket
    scheduler.sockets(io, worker)
}