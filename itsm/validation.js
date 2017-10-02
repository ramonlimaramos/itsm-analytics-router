'use strict'

const util = require('util')
const moment = require('moment')
const config = require('config').ERROR_MSG

module.exports = () => {
    const methods = {}

    methods.isQueryValid = (query) => {
        return new Promise((resolve, reject) => {
            let today = moment().format('YYYY-MM-DD'),
                yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD')

            if (!util.isNullOrUndefined(query.STARTDATE) ||
                !util.isNullOrUndefined(query.ENDDATE)) {
                let regDateMatch = /^\d{4}-\d{2}-\d{2}$/
                if (query.STARTDATE.match(regDateMatch) &&
                    query.ENDDATE.match(regDateMatch)) {

                    // checking the period for query real-time
                    if (util.isNullOrUndefined(query.INVOKE) || query.INVOKE == 'sync') {
                        let endDateDifference = moment(new Date(query.ENDDATE))
                        let startDate = moment(new Date(query.STARTDATE))
                        if (endDateDifference.diff(startDate, 'days') >= config.periodEnableQueryDate)
                            reject(config.periodEnableQueryDateMsg)
                    }

                    resolve({
                        INVOKE: query.INVOKE || 'sync',
                        STARTDATE: query.STARTDATE,
                        ENDDATE: query.ENDDATE
                    })
                } else resolve({ INVOKE: 'sync', STARTDATE: yesterday, ENDDATE: today })
            } else resolve({ INVOKE: 'sync', STARTDATE: yesterday, ENDDATE: today })
        })
    }

    methods.isNull = (data) => {
        return new Promise((resolve, reject) => {
            if (util.isNullOrUndefined(data))
                resolve(true)
            else resolve(false)
        })
    }

    methods.renderTicket = (obj) => {
        return new Promise((resolve, reject) => {
            try {
                resolve({
                    ID: obj.ID.toString(),
                    INCIDENT_TYPE: obj.INCIDENT_TYPE.toString(),
                    SERVICE_TYPE: obj.SERVICE_TYPE.toString(),
                    STEP: obj.STEP.toString(),
                    CBU: obj.CBU.toString(),
                    CREATED_BY: obj.CREATED_BY.toString(),
                    REQUESTER: obj.REQUESTER.toString(),
                    REQUESTER_COMPANY: obj.REQUESTER_COMPANY.toString(),
                    REQUESTER_DEPT: obj.REQUESTER_DEPT.toString(),
                    REQUESTER_USER_ID: obj.REQUESTER_USER_ID.toString(),
                    REQUESTER_PHONE: obj.REQUESTER_PHONE.toString(),
                    RECEIPT_BY: obj.RECEIPT_BY.toString(),
                    MAIN_OPERATOR: obj.MAIN_OPERATOR.toString(),
                    SERVICE_1ST_CATEGORY: obj.SERVICE_1ST_CATEGORY.toString(),
                    SERVICE_2ND_CATEGORY: obj.SERVICE_2ND_CATEGORY.toString(),
                    SERVICE_3RD_CATEGORY: obj.SERVICE_3RD_CATEGORY.toString(),
                    SERVICE_NAME: obj.SERVICE_NAME.toString(),
                    IMPACT: obj.IMPACT.toString(),
                    SEVERITY: obj.SEVERITY.toString(),
                    PRIORITY: obj.PRIORITY.toString(),
                    TITLE: obj.TITLE.toString(),
                    DESCRIPTION: obj.DESCRIPTION.toString(),
                    RESOLUTION: obj.RESOLUTION.toString(),
                    REASON_CODE: obj.REASON_CODE.toString(),
                    RESOLUTION_CODE: obj.RESOLUTION_CODE.toString(),
                    OPERATING_TEAM: obj.OPERATING_TEAM.toString(),
                    ASSIGNEE_P_ID: obj.ASSIGNEE_P_ID.toString(),
                    ASSIGNEE_P: obj.ASSIGNEE_P.toString(),
                    ASSIGNEE_S: obj.ASSIGNEE_S.toString(),
                    OPEN_DATE: obj.OPEN_DATE.toString(),
                    TRANSFER_DATE: obj.TRANSFER_DATE.toString(),
                    RECEIPT_DATE: obj.RECEIPT_DATE.toString(),
                    TARGET_DATE: obj.TARGET_DATE.toString(),
                    ACTUAL_START_DATE: obj.ACTUAL_START_DATE.toString(),
                    ACTUAL_RESOLVED_DATE: obj.ACTUAL_RESOLVED_DATE.toString(),
                    RESOLVED_DATE: obj.RESOLVED_DATE.toString(),
                    CLOSED_DATE: obj.CLOSED_DATE.toString(),
                    EXPECTED_DATE: obj.EXPECTED_DATE.toString(),
                    TIME_TO_RESOLVE_MIN: parseInt(obj.TIME_TO_RESOLVE_MIN),
                    SATISFACTION: parseInt(obj.SATISFACTION),
                    SATISFACTION_COMMENTS: obj.SATISFACTION_COMMENTS.toString(),
                    SATISFACTION_DATE: obj.SATISFACTION_DATE.toString(),
                    SERVICE: obj.SERVICE.toString(),
                    SERVICE_CI: obj.SERVICE_CI.toString(),
                    UAT_REQ: obj.UAT_REQ.toString(),
                    DIVISION: obj.DIVISION.toString(),
                    DEPARTMENT: obj.DEPARTMENT.toString()
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    return methods
}