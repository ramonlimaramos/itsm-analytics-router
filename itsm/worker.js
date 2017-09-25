'use strict'

const co = require('co')
const moment = require('moment')
const itsm = require('./model')()

module.exports = () => {
    const methods = {}

    methods.getMonthsByRange = (range) => {
        let monthsQuantity = range,
            current_month = { key: moment().format('MM'), val: moment().format('MMM') },
            months = monthsQuantity.map(m => {
                let month = {}
                month.key = moment().subtract(m, 'months').format('MM')
                month.val = moment().subtract(m, 'months').format('MMM')
                return month
            })
        months.push(current_month)
        return months
    }

    methods.getTeams = () => {
        return ['Infra Service', 'ERP Service', 'CRM Service', 'MES Service']
    }

    methods.getReceivedAndApprovedTeam = (params) => {
        return new Promise((resolve, reject) => {
            let teams = methods.getTeams(),
                current_year = { key: moment().format('YYYY') },
                months = methods.getMonthsByRange([3, 2, 1])

            let getData = () => { // GetData Generator
                return co(function*() {
                    let data = []
                    try {
                        for (let team of teams) {
                            for (let month of months) {
                                let query = {}
                                query.OPEN_DATE = new RegExp(`${current_year.key}-${month.key}`)
                                query.OPERATING_TEAM = team
                                let obj = {}
                                obj.team = team
                                obj.month = month
                                obj.count = yield itsm.count(query)
                                data.push(obj)
                            }
                        }
                    } catch (error) {
                        console.log(error)
                        reject(error)
                    }
                    return data
                })
            }

            let getDataHighCharts = (data) => { // GetData Highcharts Generator
                return co(function*() {
                    let highcharts = {}
                    try {
                        highcharts.categories = teams.map(t => { return t })
                        highcharts.series = []
                        for (let month of months) {
                            let serie = {}
                            serie.name = month.val
                            serie.data = teams.map((t, i) => {
                                return data.filter(obj => obj.team == t &&
                                    obj.month.val == month.val)[0].count
                            })
                            highcharts.series.push(serie)
                        }
                    } catch (error) {
                        console.log(error)
                        reject(error)
                    }
                    return highcharts
                })
            }

            co(function*() { // Main Generator
                let result = {}
                try {
                    result.data = yield getData()
                    result.highcharts = yield getDataHighCharts(result.data)
                } catch (error) {
                    console.log(error)
                    reject(error)
                }

                resolve(result)
                return true
            })
        })
    }

    methods.getReceivedAndApprovedDept = (params) => {
        return new Promise((resolve, reject) => {
            let current_year = moment().format('YYYY'),
                months = methods.getMonthsByRange([3, 2, 1]),
                openDate = months.map((e => {
                    return new RegExp(`${current_year}-${e.key}`)
                }))

            let getData = () => { // GetData Generator
                return co(function*() {
                    let data = []
                    try {
                        let query = [
                                { $match: { OPEN_DATE: { $in: openDate } } },
                                { $group: { _id: "$REQUESTER_DEPT", count: { $sum: 1 } } },
                                { $sort: { count: -1 } }
                            ],
                            queryResult = yield itsm.aggregate(query),
                            topTenDept = queryResult.map(e => { return e._id }).slice(0, 10),
                            othersDept = queryResult.map(e => { return e._id }).slice(0, queryResult.lenght)

                        for (let dept of topTenDept) {
                            for (let month of months) {
                                data.push({
                                    departament: dept,
                                    month: month,
                                    count: yield itsm.count({
                                        OPEN_DATE: new RegExp(`${current_year}-${month.key}`),
                                        REQUESTER_DEPT: dept
                                    })
                                })
                            }
                        }
                    } catch (error) {
                        console.log(error)
                        reject(error)
                    }
                    return data
                })
            }

            let getDataHighCharts = (data) => { // GetData Highcharts Generator
                return co(function*() {
                    let highcharts = {}
                    try {
                        let departs = data.map(e => { return e.departament })
                        highcharts.categories = departs.filter((elem, idx, self) => {
                            return idx == self.indexOf(elem)
                        })
                        highcharts.series = []
                        for (let month of months) {
                            highcharts.series.push({
                                name: month.val,
                                data: highcharts.categories.map((d, i) => {
                                    return data.filter(obj => obj.departament == d &&
                                        obj.month.val == month.val)[0].count
                                })
                            })
                        }
                    } catch (error) {
                        console.log(error)
                        reject(error)
                    }

                    return highcharts
                })
            }

            co(function*() { // Main Generator
                let result = {}
                try {
                    result.data = yield getData()
                    result.highcharts = yield getDataHighCharts(result.data)
                } catch (error) {
                    console.log(error)
                    reject(error)
                }

                resolve(result)
                return true
            })
        })
    }

    methods.getGranTotal = () => {
        return co(function*() {
            let year = moment().format('YYYY'),
                months = methods.getMonthsByRange([2, 1]),
                query = { OPERATING_TEAM: { $in: methods.getTeams() } },
                result = []

            try {
                for (let month of months) {
                    let obj = {}
                    query.OPEN_DATE = new RegExp(`${year}-${month.key}`)
                    obj.name = month.val
                    obj.count = yield itsm.count(query)
                    result.push(obj)
                }
                query.OPEN_DATE = new RegExp(`${year}`)
                result.push({
                    name: year,
                    count: yield itsm.count(query)
                })
            } catch (error) {
                console.log(error)
                throw error
            }
            return result
        })
    }

    methods.getNotAcceptedHaeb = () => {
        return co(function*() {
            let result
            try {
                let delayed = [];
                result = yield itsm.findAll({ STEP: "New" }, {})
                for (let res of result.docs) {
                    let compareDate = moment(new Date(res.OPEN_DATE)).add(1, "d")
                    if (compareDate.isBefore(moment()))
                        delayed.push(res)
                }
                result.delayed = delayed
            } catch (error) {
                console.log(error)
                throw error
            }
            return result
        })
    }

    methods.getPeriodDaysDelayed = () => {
        return co(function*() {
            let result
            try {
                let ninghteeDaysAgo = moment().subtract(90, 'd').format('YYYY-MM-DD')
                let query = {
                    $and: [
                        { OPEN_DATE: { $lte: `${ninghteeDaysAgo} 00:00:00.0` } },
                        {
                            $nor: [
                                { STEP: "Closed" },
                                { STEP: "Closed (Reject)" }
                            ]
                        }
                    ]
                }
                result = yield itsm.findAll(query, {})
            } catch (error) {
                console.log(error)
                throw error
            }

            return result
        })
    }

    methods.getResolutionDelay = () => {
        return co(function*() {
            let result
            try {
                let today = moment().format('YYYY-MM-DD')
                let query = {
                    $and: [
                        { TARGET_DATE: { $lte: `${today} 00:00:00.0` } },
                        {
                            $nor: [
                                { STEP: "New" },
                                { STEP: "Closed" },
                                { STEP: "Closed (Reject)" }
                            ]
                        }
                    ]
                }
                result = yield itsm.findAll(query, {})
            } catch (error) {
                console.log(error)
                throw error
            }

            return result
        })
    }

    return methods
}