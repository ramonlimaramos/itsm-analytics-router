// itsm-analytics-router/index_scheduler.js

'use strict'

const io = require('./config/socketio')()
const scheduler = require('./itsm/scheduler')(io)
scheduler.middleware() // starting scheduler data collection
scheduler.metrics() // starting scheduler metrics calculation
scheduler.sockets() // starting scheduler getter results
scheduler.received() // starting scheduler getter results
scheduler.resolved() // starting scheduler getter results