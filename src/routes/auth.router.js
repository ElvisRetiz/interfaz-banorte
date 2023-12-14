const express = require("express");
const passport = require("passport");

const AuthService = require('../services/auth.service');

const router = express.Router();
const service = new AuthService();

router.post("/login",
    passport.authenticate('local', { session: false }),
    async (req, res, next) => {
        try {
            const user = req.user;
            res.status(201).json(service.signToken(user));
        } catch (error) {
            next(error);
        }
    }
);

module.exports = router;