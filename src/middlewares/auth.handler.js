const boom = require('@hapi/boom');

const { config } = require('../config/config');

function checkApiKey(req, res, next) {
    const apikey = req.headers['api-key'];
    if (apikey === config.apikey) {
        next();
    } else {
        next(boom.unauthorized());
    }
}

function checkAcces(req, res, next) {
    const user = req.user;
    if (user.sub === config.sentinel) {
        next();
    } else {
        next(boom.unauthorized());
    }
}

//Midleware para verificacion de roles en caso de que existan
function checkRoles(...roles) {
    return (req, res, next) => {
        const user = req.user;
        if (roles.includes(user.role)) {
            next();
        } else {
            next(boom.unauthorized());
        }
    }
}

module.exports = { checkApiKey }