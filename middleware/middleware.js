// itsm-analytics-router/middleware/middleware.js

'use strict'

const config = require('config').ITSM_EAI_INTERFACE_PRD
const request = require('request')
const co = require('co')

module.exports = () => {
    const middleware = {}

    middleware.execute = (input) => {
        return new Promise((resolve, reject) => {
            let result, auth
            co(function*() {
                try {
                    auth = yield middleware.auth()
                    result = yield middleware.request(auth, input)
                } catch (error) {
                    reject(error)
                }

                resolve(result)
                return true
            })
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

    middleware.request = (auth, input) => {
        return new Promise((resolve, reject) => {
            request.post({
                uri: config.endpointSync,
                form: input,
                headers: auth
            }, (err, response, body) => {
                if (err) return reject(response)
                resolve(JSON.parse(body))
            })
        })
    }

    return middleware
}