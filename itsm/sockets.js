'use strict'

module.exports = (io) => {
    io.sockets.on('connection', socket => {
        console.log(`Socket host-client ${socket.request.socket.remoteAddress} connected`)

        // describe sockets actions
        // socket.on('something', data => {})

        // broadcast
        // io.sockets.emit('another something', ())

        socket.on('disconnect', () => {
            console.log(`Socket host-client ${socket.request.socket.remoteAddress} disconnected`)
        })
    })
}