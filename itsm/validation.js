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

    return methods
}