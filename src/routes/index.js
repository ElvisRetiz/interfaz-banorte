const express = require('express');
const passport = require("passport");

const { checkApiKey } = require('../middlewares/auth.handler');

const filesRouter = require('./files.router');
const payrollRouter = require('./payroll.router');
const authRouter = require('./auth.router');

function routerApi(app) {
    const router = express.Router();
    app.use('/api/v1', checkApiKey, router);
    router.use('/files', passport.authenticate('jwt', { session: false }), filesRouter);
    router.use('/payroll', passport.authenticate('jwt', { session: false }), payrollRouter);
    router.use('/auth', authRouter);
}

module.exports = routerApi;