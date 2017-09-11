// itsm-analytics-router/config/express.js

'use strict'

const path = require('path')

const express = require('express')
const itsm = require('../itsm/index')
const bodyParser = require('body-parser')

module.exports = () => {
    const app = express()
    app.set('port', process.env.PORT || 5111)
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(require('method-override')())
    app.disable('x-powered-by')
    app.use(express.static(path.join(__dirname, 'public')))
    app.use((req, res, next) => { // API Cross Domain
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        next()
    })
    app.use((req, res, next) => { //Method Validation
        let method = req.originalMethod
        if (method != 'GET' && method != 'POST' && method != 'OPTIONS')
            res.status(405).json({ result: 'Method not allowed' })
        else
            next()
    })
    app.use((err, req, res, next) => { //Error Handle
        res.status(500).json({ error: err.message })
        next(err)
    })

    // routes definition
    itsm(app)

    return app
}