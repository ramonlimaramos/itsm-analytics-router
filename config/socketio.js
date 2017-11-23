'use strict'

const config = require('config').SOCKET
const socketio = require('socket.io', config)

//const itsmSockets = require('../itsm/sockets')

module.exports = express => socketio(express || 9006)