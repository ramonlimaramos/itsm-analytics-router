'use strict'

const config = require('config').JWT
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const user = require('./model')()

module.exports = () => {
    let params = {
        secretOrKey: config.jwt_secret,
        jwtFromRequest: ExtractJwt.fromAuthHeader()
    }

    let strategy = new JwtStrategy(params, (payload, done) => {
        user.findById(payload.id).then((user) => {
            if (user)
                return done(null, {
                    id: user.ID,
                    name: user.NAME,
                    email: user.EMAIL
                })
            return done(null, false)
        }).catch(error => done(error, null))
    })

    passport.use(strategy)

    return {
        initialize: () => {
            return passport.initialize()
        },
        authenticate: () => {
            return passport.authenticate('jwt', config.jwt_session)
        }
    }
}