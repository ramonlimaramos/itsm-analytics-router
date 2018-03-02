'use strict'

const config = require('config').MONGO.msg
const mongo = require('../config/mongo')()


const userSchema = new mongo.schema.Schema({
    ID: { type: String, unique: true },
    NAME: String,
    EMAIL: String
}, { 'strict': false })

userSchema.plugin(mongo.paginate)
const userModel = mongo.schema.model('User', userSchema)

module.exports = () => {
    let methods = {}

    methods.save = (obj) => {
        return new Promise((resolve, reject) => {
            userModel.findOneAndUpdate({ ID: obj.id }, obj, { upset: true }, (err, doc) => {
                if (err) reject(err)
                resolve(doc)
            })
        })
    }

    methods.findAll = () => {
        return new Promise((resolve, reject) => {
            let options = {
                offset: opt.offset || 0,
                limit: opt.limit || 50,
                page: opt.page || 0,
                sort: { execution_time: 'desc' }
            }

            userModel.paginate(params, options, (err, result) => {
                if (err) reject(err)
                resolve(result)
            })
        })
    }

    methods.findById = (id) => {
        return new Promise((resolve, reject) => {
            userModel.findOne({ ID: id }, (err, user) => {
                if (err) reject(err)
                resolve(user)
            })
        })
    }

    return methods
}