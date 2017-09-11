// itsm-analytics-router/itsm/model.js

'use strict'

const mongo = require('../config/mongo')()

const ticketSchema = new mongo.schema.Schema({
    ID: String,
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
    OPEN_DATE: Date,
    TRANSFER_DATE: Date,
    RECEIPT_DATE: Date,
    TARGET_DATE: Date,
    ACTUAL_START_DATE: Date,
    ACTUAL_RESOLVED_DATE: Date,
    RESOLVED_DATE: Date,
    CLOSED_DATE: Date,
    EXPECTED_DATE: Date,
    TIME_TO_RESOLVE_MIN: Number,
    SATISFACTION: Number,
    SATISFACTION_COMMENTS: String,
    SATISFACTION_DATE: Date,
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
                    resolve(result)
                })

        })
    }

    /*methods.findAll = (params, opt) => {
        return new Promise((resolve, reject) => {
            let options = {
                offset: opt.offset || 0,
                limit: opt.limit || 50,
                page: opt.page || 0,
                sort: { execution_time: 'desc' }
            }

            EarlyWarningModel.paginate(params, options, (err, result) => {
                if (err) reject(err)
                resolve(result)
            })
        })
    }

    methods.findById = (full_warning_id) => {
        return new Promise((resolve, reject) => {
            EarlyWarningModel.findOne({ full_warning_id: full_warning_id }, (err, ew) => {
                if (err) reject(err)
                resolve(ew)
            })
        })
    }*/

    return methods
}