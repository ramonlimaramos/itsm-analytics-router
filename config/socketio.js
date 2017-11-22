'use strict'

const config = require('config').SOCKET
const socketio = require('socket.io', config)
    //const itsmSockets = require('../itsm/sockets')

module.exports = (express) => {
    const io = socketio(express)

    // Declare application sockets
    // itsmSockets(io) un-used

    return io
}