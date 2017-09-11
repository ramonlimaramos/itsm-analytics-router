// itsm-analytics-router/middleware/middleware.js

'use strict'

const config = require('config').ITSM_EAI_INTERFACE_DEV
const request = require('request')

module.exports = () => {
    const middleware = {}

    middleware.execute = () => {
        return new Promise((resolve, reject) => {
            middleware.auth()
                .then(middleware.request)
                .then(result => resolve(result))
                .catch(err => reject(err))
        })
    }

    middleware.auth = () => {
        return new Promise((resolve, reject) => {
            let bufferObj = new Buffer(`${config.user}:${config.password}`).toString("base64")
            let authObj = {
                "Content-Type": "application/json",
                "Authorization": `Basic ${bufferObj}`
            }
            resolve(authObj)
        })
    }

    middleware.request = (auth) => {
        return new Promise((resolve, reject) => {
            request.post({
                uri: config.endpointSync,
                form: { INVOKE: "sync" },
                headers: auth
            }, (err, response, body) => {
                if (err) return reject(response)
                resolve(JSON.parse(body))
            })
        })
    }

    return middleware
}