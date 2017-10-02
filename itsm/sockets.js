'use strict'

const moment = require('moment')
const util = require('util')
const worker = require('./worker')()
const scheduler = require('./scheduler')()
const co = require('co')

module.exports = (io) => {
    io.sockets.on('connection', socket => {
        console.log(`ITSM Analytics host-client ${socket.request.socket.remoteAddress} connected`)

        // sockets actions as routes
        socket.on('receivedAndApproved', data => {
            co(function*() {
                let result = yield worker.getReceivedAndApprovedTeam()
                socket.emit('receivedAndApprovedResponse', result)
            })
        })

        socket.on('granTotal', data => {
            co(function*() {
                let result = yield worker.getGranTotal()
                socket.emit('granTotalResponse', result)
            })
        })

        socket.on('receivedAndApprovedDept', data => {
            co(function*() {
                let result = yield worker.getReceivedAndApprovedDept()
                socket.emit('receivedAndApprovedDeptResponse', result)
            })
        })

        socket.on('ongoingNotAcceptedHaeb', data => {
            co(function*() {
                let result = yield worker.getNotAcceptedHaeb()
                socket.emit('ongoingNotAcceptedHaebResponse', result)
            })
        })

        socket.on('ongoingPeriodDaysDelayed', data => {
            co(function*() {
                let result = yield worker.getPeriodDaysDelayed()
                socket.emit('ongoingPeriodDaysDelayedResponse', result)
            })
        })

        socket.on('ongoingResolutionDelay', data => {
            co(function*() {
                let result = yield worker.getResolutionDelay()
                socket.emit('ongoingResolutionDelayResponse', result)
            })
        })

        socket.on('ongoingSLASatisfactionTeam', data => {
            co(function*() {
                let result = yield worker.getSLASatisfactionTeam()
                socket.emit('ongoingSLASatisfactionTeamResponse', result)
            })
        })

        socket.on('ongoingSLAAcceptence', data => {
            co(function*() {
                let result = yield worker.getSLAAcceptence()
                socket.emit('ongoingSLAAcceptenceResponse', result)
            })
        })

        // Starting Emittion Scheduler
        scheduler.sockets(socket, worker)

        socket.on('disconnect', () => {
            console.log(`ITSM Analytics host-client ${socket.request.socket.remoteAddress} disconnected`)
        })
    })
}