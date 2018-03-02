// itsm-analytics-router/config/mongo.js

'use strict'

const config = require('config').MONGO
const mongoose = require('mongoose')
const uriUtil = require('mongodb-uri')
const mongoosePaginate = require('mongoose-paginate')
const uri = require('util')
    .format(config.uri,
        encodeURIComponent(config.user),
        encodeURIComponent(config.pwd))

require('mongoose-moment')(mongoose)

// Connecting one time singleton
mongoose.connect(uriUtil.formatMongoose(uri), config.options)

module.exports = () => {
    const db = {}

    db.connectionString = uri
    db.schema = mongoose
    db.connection = mongoose.connection
    db.port = config.port
    db.paginate = mongoosePaginate

    return db
}