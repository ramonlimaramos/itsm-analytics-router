'use strict'

const moment = require('moment')
const util = require('util')
const worker = require('./worker')()
const scheduler = require('./scheduler')()
const co = require('co')

module.exports = (io) => {

    // Emitting data for sockets on ONGOING RULE
    io.of('/ongoing').on('connection', socket => {
        console.log(`ITSM Analytics host-client ${socket.request.socket.remoteAddress} connected ongoing`)
        co(function*() {
            try {
                socket.emit('ongoingNotAcceptedHaeb', yield worker.getNotAcceptedHaeb())
                socket.emit('ongoingPeriodDaysDelayed', yield worker.getPeriodDaysDelayed())
                socket.emit('ongoingResolutionDelay', yield worker.getResolutionDelay())
                socket.emit('ongoingSLASatisfactionTeam', yield worker.getSLASatisfactionTeam())
                socket.emit('ongoingSLAAcceptence', yield worker.getSLAAcceptence())
            } catch (error) {
                console.error(error)
            }
        })
        socket.on('disconnect', () => {
            console.log(`ITSM Analytics host-client ${socket.request.socket.remoteAddress} disconnected from ongoing`)
        })
    })

    // Emitting data for sockets on RECEIVED RULE
    io.of('/received').on('connection', socket => {
        console.log(`ITSM Analytics host-client ${socket.request.socket.remoteAddress} connected received`)
        co(function*() {
            try {
                socket
                    .emit('receivedReceivedAndApprovedTeam', yield worker.getReceivedAndApprovedTeam())
                socket
                    .emit('receivedGranTotal', yield worker.getGranTotal())
                socket
                    .emit('receivedReceivedAndApprovedDept', yield worker.getReceivedAndApprovedDept())
            } catch (error) {
                console.error(error)
            }
        })
        socket.on('disconnect', () => {
            console.log(`ITSM Analytics host-client ${socket.request.socket.remoteAddress} disconnected from received`)
        })
    })

    // Starting Emittion Scheduler for each socket
    scheduler.sockets(io, worker)
}