// itsm-analytics-router/itsm/model.js

'use strict'

const config = require('config').MONGO.msg
const mongo = require('../config/mongo')()

const ticketSchema = new mongo.schema.Schema({
    ID: { type: String, unique: true },
    INCIDENT_TYPE: String,
    SERVICE_TYPE: String,
    STEP: String,
    CBU: String,
    CREATED_BY: String,
    REQUESTER: String,
    REQUESTER_COMPANY: String,
    REQUESTER_DEPT: String,
    REQUESTER_USER_ID: Number,
    REQUESTER_PHONE: String,
    RECEIPT_BY: String,
    MAIN_OPERATOR: String,
    SERVICE_1ST_CATEGORY: String,
    SERVICE_2ND_CATEGORY: String,
    SERVICE_3RD_CATEGORY: String,
    SERVICE_NAME: String,
    IMPACT: String,
    SEVERITY: String,
    PRIORITY: String,
    TITLE: String,
    DESCRIPTION: String,
    RESOLUTION: String,
    REASON_CODE: String,
    RESOLUTION_CODE: String,
    OPERATING_TEAM: String,
    ASSIGNEE_P_ID: String,
    ASSIGNEE_P: String,
    ASSIGNEE_S: String,
    OPEN_DATE: String,
    TRANSFER_DATE: String,
    RECEIPT_DATE: String,
    TARGET_DATE: String,
    ACTUAL_START_DATE: String,
    ACTUAL_RESOLVED_DATE: String,
    RESOLVED_DATE: String,
    CLOSED_DATE: String,
    EXPECTED_DATE: String,
    TIME_TO_RESOLVE_MIN: Number,
    SATISFACTION: Number,
    SATISFACTION_COMMENTS: String,
    SATISFACTION_DATE: String,
    SERVICE: String,
    SERVICE_CI: String,
    UAT_REQ: String,
    DIVISION: String,
    DEPARTMENT: String
}, { 'strict': false })

ticketSchema.plugin(mongo.paginate)
const ticketModel = mongo.schema.model('ITSMData', ticketSchema)

module.exports = () => {
    let methods = {}

    methods.bulkMerge = (input) => {
        return new Promise((resolve, reject) => {
            let bulk = ticketModel.collection.initializeOrderedBulkOp()
            let sizeTickets = input.length
            let counter = 0

            for (let index = 0; index < sizeTickets; index++) {
                bulk.find({ ID: input[index].ID }).upsert().updateOne(input[index])
                counter++

                if (counter % 1000 == 0)
                    bulk.execute((err, result) => {
                        if (err) reject(err)
                        bulk = ticketModel.collection.initializeOrderedBulkOp()
                    })
            }

            if (counter % 1000 != 0)
                bulk.execute((err, result) => {
                    if (err) reject(err)
                    resolve(config.bulkupdated)
                })

        })
    }

    methods.findAll = (params, opt) => {
        return new Promise((resolve, reject) => {
            let options = {
                offset: opt.offset || 0,
                limit: opt.limit || 50,
                page: opt.page || 0,
                sort: { OPEN_DATE: 'asc' }
            }

            ticketModel.paginate(params, options, (err, result) => {
                if (err) reject(err)
                resolve(result)
            })
        })
    }

    methods.findById = (id) => {
        return new Promise((resolve, reject) => {
            ticketModel.findOne({ ID: id }, (err, ticket) => {
                if (err) reject(err)
                resolve(ticket)
            })
        })
    }

    methods.count = (query) => {
        return new Promise((resolve, reject) => {
            ticketModel.count(query, (err, count) => {
                if (err) reject(err)
                resolve(count)
            })
        })
    }

    methods.aggregate = (query) => {
        return new Promise((resolve, reject) => {
            ticketModel.aggregate(query, (err, result) => {
                if (err) reject(err)
                resolve(result)
            })
        })
    }

    methods.distinct = (field) => {
        return new Promise((resolve, reject) => {
            ticketModel.distinct(field, (err, result) => {
                if (err) reject(err)
                resolve(result)
            })
        })
    }

    return methods
}