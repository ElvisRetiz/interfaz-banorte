const express = require("express");

const FileService = require('../services/file.service');

const router = express.Router();
const service = new FileService();

router.post("/generate", async (req, res, next) => {
    try {
        const { payrollNumber, payrollType, payrollYear, requestType } = req.body;
        const data = await service.encryptFile(payrollNumber, payrollType, payrollYear, requestType);
        res.status(201).json({
            data
        });
    } catch (error) {
        next(error);
    }
});

router.post("/preview", async (req, res, next) => {
    try {
        const { payrollNumber, payrollType, payrollYear, requestType } = req.body;
        const data = await service.getDataFile(payrollNumber, payrollType, payrollYear, requestType);
        res.status(201).json({
            data
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;