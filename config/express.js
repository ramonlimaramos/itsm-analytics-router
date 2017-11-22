// itsm-analytics-router/config/express.js

'use strict'

const path = require('path')

// Not in use
//const templateEngine = require('express-dot-engine')
// const auth = require('../auth')()

const express = require('express')
const config = require('config')
const itsm = require('../itsm')
const bodyParser = require('body-parser')

module.exports = () => {
    const app = express()

    // Port Definition
    app.set('port', process.env.PORT || 5111)

    // Authorization Initialization
    // app.use(auth.initialize())

    // Body Http Part Configuration
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
    app.use(bodyParser.json({ limit: '50mb' }))
    app.use(require('method-override')())
    app.disable('x-powered-by')

    // Views and Template Engine Configuration
    // app.use('/itsm-analytics', express.static(path.join(__dirname, '../public')))
    // app.engine('dot', templateEngine.__express)
    // app.set('views', path.join(__dirname, '../views'))
    // app.set('view engine', 'dot')

    // API Cross Domain
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
        next()
    })

    // API Method Validation
    app.use((req, res, next) => {
        let method = req.method
        if (method != 'GET' &&
            method != 'POST' &&
            method != 'PUT' &&
            method != 'DELETE' &&
            method != 'OPTIONS')
            res.status(405).json({ result: config.ERROR_MSG.method_not_allowed })
        else
            next()
    })

    // Routes Definition
    itsm(app)

    // Error Handle
    app.use((err, req, res, next) => {
        res.status(500).json(config.ERROR_MSG[500])
        next(err)
    })
    app.use((req, res, next) => {
        res.status(404).json(config.ERROR_MSG[404]);
    });

    return app
}