const express = require("express");

const PayrollService = require('../services/payroll.service');

const router = express.Router();
const service = new PayrollService();

router.get("/types",
    async (req, res, next) => {
        try {
            const data = await service.getTypes();
            res.status(200).json({
                data
            })
        } catch (error) {
            next(error);
        }
    });
router.get("/dates/:year",
    async (req, res, next) => {
        try {
            const { year } = req.params
            const data = await service.getDates(year);
            res.status(200).json({
                data
            })
        } catch (error) {
            next(error);
        }
    });

module.exports = router;