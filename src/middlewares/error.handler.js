const boom = require('@hapi/boom');
const dayjs = require('dayjs');
const fs = require('fs');
const path = require('path');

function logErrors(err, req, res, next) {
    console.log(err);
    fs.appendFileSync(path.join(__dirname, '../../logs/error.log'), `${dayjs().format('DD/MM/YYYY hh:mm:ss a')} - ${err.stack} - ${err}\n`);
    next(err);
}

function errorHandler(err, req, res, next) {
    res.status(500).json({
        message: err.message,
        stack: err.stack,
    });
}

function boomErrorHandler(err, req, res, next) {
    if (err.isBoom) {
        const { output } = err;
        res.status(output.statusCode).json(output.payload);
    }
    next(err);
}

module.exports = { logErrors, errorHandler, boomErrorHandler }