// itsm-analytics-router/config/express.js

'use strict'

const path = require('path')

const express = require('express')
const itsm = require('../itsm')
const bodyParser = require('body-parser')

module.exports = () => {
    const app = express()
    app.set('port', process.env.PORT || 5111)
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    app.use(bodyParser.json({ limit: '50mb' }))
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
        let method = req.method
        if (method != 'GET' &&
            method != 'POST' &&
            method != 'PUT' &&
            method != 'DELETE' &&
            method != 'OPTIONS')
            res.status(405).json({ result: config.msg.method_not_allowed })
        else
            next()
    })

    // routes definition
    itsm(app)

    app.use((err, req, res, next) => { //Error Handle
        res.status(500).json({ error: err.message })
        next(err)
    })
    app.use((req, res, next) => { // 404 Handler
        res.status(404).json(config.msg.not_found);
    });

    return app
}