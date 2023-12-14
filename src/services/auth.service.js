const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');
const jwt = require("jsonwebtoken");

const { config } = require('../config/config');

class AuthService {
    constructor() {
    }

    async getUser(username, password) {
        if (username !== config.user) {
            throw boom.unauthorized();
        }
        //const isMatch = await bcrypt.compare(password, config.pwd);
        const isMatch = password === config.pwd;
        if (!isMatch) {
            throw boom.unauthorized();
        }
        return config.user
    }

    signToken(user) {
        const payload = {
            sub: config.sentinel,
            scope: "general"
        };
        const token = jwt.sign(payload, config.jwtSecret);
        return {
            user,
            token
        }
    }

}

module.exports = AuthService;