'use strict'

const socketio = require('socket.io')
const itsmSockets = require('../itsm/sockets')

module.exports = (express) => {
    const io = socketio(express)

    // Declare application sockets
    itsmSockets(io)

    return io
}