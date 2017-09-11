'use strict'

const socketio = require('socket.io')

module.exports = (express, redis) => {
    socketio(express)
    socketio.adapter(redis({
        host: config.REDIS.host,
        port: config.REDIS.port
    }))
}