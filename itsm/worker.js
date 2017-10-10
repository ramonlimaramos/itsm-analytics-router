'use strict'

const co = require('co')
const config = require('config').ITSM
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
            let result = {}
            try {
                let delayed = [];
                result.notDelayed = yield itsm.findAll({
                    $query: { STEP: "New" },
                    $orderby: { OPEN_DATE: 1 }
                })
                for (let res of result.notDelayed) {
                    let compareDate = moment(res.OPEN_DATE).add(1, "d")
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
                let period = moment().subtract(config.period_delay, 'd').format('YYYY-MM-DD')
                let query = {
                    $query: {
                        $and: [
                            { OPEN_DATE: { $lte: `${period} 00:00:00.0` } },
                            {
                                $nor: [
                                    { STEP: "Closed" },
                                    { STEP: "Closed (Reject)" }
                                ]
                            }
                        ]
                    },
                    $orderby: { OPEN_DATE: 1 }
                }
                result = yield itsm.findAll(query)
            } catch (error) {
                console.log(error)
                throw error
            }

            return result
        })
    }

    methods.getResolutionDelay = () => {
        return co(function*() {
            try {
                let today = moment().add(24, 'h').format('YYYY-MM-DD')
                let query = {
                    $query: {
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
                    },
                    $orderby: { OPEN_DATE: 1 }
                }
                return yield itsm.findAll(query)
            } catch (error) {
                console.log(error)
                throw error
            }
        })
    }

    methods.getSLASatisfactionTeam = (all) => {
        return co(function*() {
            let query = [{
                        $match: {
                            $and: [
                                { OPEN_DATE: new RegExp(moment().format('YYYY')) },
                                { SATISFACTION: { $ne: 0 } }
                            ]
                        }
                    },
                    {
                        $group: {
                            _id: (all) ? null : "$OPERATING_TEAM",
                            avgSatisfaction: { $avg: "$SATISFACTION" },
                            totalTickets: { $sum: 1 }
                        }
                    },
                    { $sort: { avgSatisfaction: -1 } }
                ],
                result
            try {
                let data = yield itsm.aggregate(query)
                result = (all) ? data[0] : {
                    currentTeams: methods
                        .getTeams()
                        .map(t => {
                            return data.filter(obj => { return obj._id == t })[0]
                        })
                }
            } catch (error) {
                console.log(error)
                throw error
            }

            return result
        })
    }

    methods.getSLAAcceptence = () => {
        return co(function*() {
            let list, conditions,
                result = {},
                countOpenLessThanReceipt = 0
            try {
                conditions = {
                    $query: {
                        $and: [
                            { OPEN_DATE: new RegExp(moment().format('YYYY')) },
                            {
                                $nor: [
                                    { STEP: "New" },
                                    { STEP: "Closed (Reject)" }
                                ]
                            }
                        ]
                    },
                    $orderby: { OPEN_DATE: 1 }
                }
                list = yield itsm.findAll(conditions)

                for (let item of list) {
                    let openDate = moment(item.OPEN_DATE).add(1, 'd'),
                        receiptDate = moment(item.RECEIPT_DATE)
                    if (receiptDate.diff(openDate, 'days') > 24)
                        countOpenLessThanReceipt++
                }

                result.total = list.length
                result.totalOpenLessReceipt = countOpenLessThanReceipt
                result.percent = (100 - ((countOpenLessThanReceipt / result.total) * 100)).toFixed(2)
            } catch (error) {
                console.log(error)
                throw error
            }
            return result
        })
    }

    methods.getResolution = () => {
        return co(function*() {
            let list, conditions,
                result = {},
                count = 0
            try {
                conditions = {
                    $query: {
                        $and: [
                            { OPEN_DATE: new RegExp(moment().format('YYYY')) },
                            { STEP: "Closed" }
                        ]
                    },
                    $orderby: { OPEN_DATE: 1 }
                }

                list = yield itsm.findAll(conditions)
                for (let item of list) {
                    let resolvedDate = moment(item.RESOLVED_DATE),
                        targetDate = moment(item.TARGET_DATE)
                    if (resolvedDate.isAfter(targetDate, 'hours'))
                        count++
                }

                result.total = list.length
                result.count = count
                result.percent = (((result.total - count) / result.total) * 100).toFixed(2)
            } catch (error) {
                console.log(error)
                throw error
            }
            return result
        })
    }

    methods.totalTicketsMetrics = () => {
        return co(function*() {
            let result = {}
            try {
                let months = methods.getMonthsByRange([
                        ...Array(parseInt(moment().format('MM'))).keys()
                    ]),

                    query = yield itsm.findAll({
                        OPEN_DATE: new RegExp(moment().format('YYYY'))
                    }),

                    totalYearOpen = query.filter(o => {
                        return o.STEP !== "Closed (Reject)" && o.STEP !== "Cancel"
                    }).length,

                    totalResolved = query.filter(o => o.STEP == "Closed").length

                months.pop()

                result.total = totalYearOpen
                result.percentResolved = ((totalResolved / totalYearOpen) * 100).toFixed(2)
                result.percentNotResolved = (100 - result.percentResolved).toFixed(2)
                result.data = []

                months.forEach((obj, idx) => {
                    let currMonth = query.filter(o => {
                        return moment().month(moment(o.OPEN_DATE).format('MMM'), 'months')
                            .isSame(moment().month(obj.val), 'months') &&
                            o.STEP !== "Closed (Reject)"
                    })
                    obj.total = currMonth.length
                    obj.resolved = currMonth.filter(o => o.STEP == "Closed").length
                    obj.notResolved = currMonth.filter(o => o.STEP !== "Closed").length

                    result.data.push(obj)
                })
            } catch (error) {
                console.log(error)
                throw error
            }

            return result
        })
    }
    return methods
}