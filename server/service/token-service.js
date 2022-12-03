const jwt = require('jsonwebtoken')
const tokenModel = require('../models/token-model')

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {expiresIn: '30d'})

        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET_KEY)
            return userData
        } catch(err) {
            return null
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY)
            return userData
        } catch(err) {
            return null
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({user: userId})
        if(tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }

        return await tokenModel.create({user: userId, refreshToken})
    }

    async removeToken(refreshToken) {
        return await tokenModel.deleteOne({refreshToken});
    }

    async findToken(refreshToken) {
        return await tokenModel.findOne({refreshToken});
    }
}

module.exports = new TokenService()