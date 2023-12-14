const boom = require('@hapi/boom');

const sequelize = require('../libs/sequelize.lib');

class PayrollService {
    constructor() {
    }

    async getTypes() {
        const payrrollTypes = await sequelize.query('select TP_TIPO, TP_NOMBRE from TPERIODO',
            {
                type: sequelize.QueryTypes.SELECT,
            });
        if (payrrollTypes.length === 0) {
            throw boom.badRequest("Informacion de periodos no disponible");
        }
        return payrrollTypes
    }

    async getDates(payrollYear) {
        payrollYear = parseInt(payrollYear, 10);
        const payrollDates = await sequelize.query('select PE_TIPO, PE_NUMERO, CONVERT(varchar,PE_FEC_INI,1) as PE_FEC_INI, CONVERT(varchar,PE_FEC_FIN,1) as PE_FEC_FIN from PERIODO where PE_YEAR = :payrollYear',
            {
                type: sequelize.QueryTypes.SELECT,
                replacements: { payrollYear }
            });
        if (payrollDates.length === 0) {
            throw boom.badRequest("Informacion de periodos no disponible");
        }
        return payrollDates
    }
}

module.exports = PayrollService;