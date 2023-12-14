const fs = require('fs');
const path = require('path');
const openpgp = require('openpgp');
const boom = require('@hapi/boom');

const sequelize = require('../libs/sequelize.lib');
const { config } = require('../config/config');

class FileService {
    constructor() {
        this.requestTypes = ['general', 'pensionOne', 'pensionTwo'];
        this.headerQueries = {
            general: 'KitBanorteEncabezado',
            pensionOne: 'KitBanorteEncabezadoPensionUno',
            pensionTwo: 'KitBanorteEncabezadoPensionDos'
        };
        this.detailQueries = {
            general: 'KitBanorteDetalle',
            pensionOne: 'KitBanorteDetallePensionUno',
            pensionTwo: 'KitBanorteDetallePensionDos'
        };
        this.fileSchema = {
            header: this.headerQueries.general,
            detail: this.detailQueries.general
        };
    }

    handleRequest(requestType) {
        if (!this.requestTypes.includes(requestType)) {
            throw boom.badRequest('El tipo de peticion no coincide con los tipos permitidos');
        }
        this.fileSchema.header = this.headerQueries[requestType];
        this.fileSchema.detail = this.detailQueries[requestType];
    }

    async getData(payrollNumber, payrollType, payrollYear, requestType) {
        payrollNumber = parseInt(payrollNumber, 10);
        payrollType = parseInt(payrollType, 10);
        payrollYear = parseInt(payrollYear, 10);
        this.handleRequest(requestType);
        const header = await sequelize.query(`EXEC ${this.fileSchema.header} :payrollNumber, :payrollType, :payrollYear`, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { payrollNumber, payrollType, payrollYear }
        });
        const detail = await sequelize.query(`EXEC ${this.fileSchema.detail} :payrollNumber, :payrollType, :payrollYear`, {
            type: sequelize.QueryTypes.SELECT,
            replacements: { payrollNumber, payrollType, payrollYear }
        });
        if (header.length === 0 || detail.length === 0 || !header[0].TotalDeImporte) {
            throw boom.badRequest('No se encontro informacion con los parametros utilizados')
        }
        return {
            header: header[0],
            detail: detail
        }
    }

    handleData(data) {
        let header = "";
        let detail = "";
        Object.values(data.header).map(element => header += element);
        let rows = data.detail.map(element => {
            let row = "";
            Object.values(element).map(value => row += value);
            return row
        });
        rows.forEach(element => detail += `\n${element}`);
        return {
            header,
            detail
        }
    }

    createFile(data, txtName) {
        fs.writeFileSync(path.join(config.output, txtName), data.header);
        fs.appendFileSync(path.join(config.output, txtName), data.detail);
        let file = fs.readFileSync(path.join(config.output, txtName), 'utf-8');
        return file;
    }

    deleteFile(txtName) {
        fs.unlinkSync(path.join(config.output, txtName));
    }

    createEncryptedFile(encryptedData, fileName) {
        fs.writeFileSync(path.join(config.output, fileName), encryptedData);
    }

    nameFormatting(stationNumber, consecutive) {
        let fileName = '';
        const PREFIX = 'NI';
        const FILE_NAME_EXTENSION = '.PAG';
        fileName = `${PREFIX}${stationNumber}${consecutive}${FILE_NAME_EXTENSION}`;
        return fileName;
    }

    async getPublicKeyArmored() {
        let publicKey = fs.readFileSync(path.join(__dirname, '../../keys/banorte/MagnaPub.key'), 'utf-8');
        let publicKeyArmored = await openpgp.readKey({ armoredKey: publicKey });
        return publicKeyArmored;
    }

    handleDetail(detail) {
        let newDetail = detail.map(element => {
            return {
                NumeroDeEmpleado: element.NumeroDeEmpleado,
                Importe: element.Importe,
                NumeroDeCuenta: element.NumeroDeCuenta,
            }
        })

        return newDetail
    }

    getConsecutive(rawData) {
        return parseInt(rawData);
    }

    async updateConsecutive(consecutive) {
        let consecutiveValidated = parseInt(consecutive, 10);
        await sequelize.query('EXEC KitBanorteActualizarConsecutivo :consecutiveValidated', {
            type: sequelize.QueryTypes.SELECT,
            replacements: { consecutiveValidated }
        })
    }

    async encryptFile(payrollNumber, payrollType, payrollYear, requestType) {
        const TXT_NAME = 'RAW.txt';
        let data = await this.getData(payrollNumber, payrollType, payrollYear, requestType);
        let consecutive = this.getConsecutive(data.header.Consecutivo);
        let response = this.handleDetail(data.detail);
        let fileName = this.nameFormatting(data.header.Emisora, data.header.Consecutivo);
        data = this.handleData(data);
        let plainTxtFile = this.createFile(data, TXT_NAME);
        let publicKeyArmored = await this.getPublicKeyArmored();
        let encryptedFile = await openpgp.encrypt({
            message: await openpgp.createMessage({ text: plainTxtFile }),
            encryptionKeys: publicKeyArmored
        });
        this.createEncryptedFile(encryptedFile, fileName);
        this.deleteFile(TXT_NAME);
        this.updateConsecutive(consecutive);
        return response
    }

    async getDataFile(payrollNumber, payrollType, payrollYear, requestType) {
        let data = await this.getData(payrollNumber, payrollType, payrollYear, requestType);
        let response = this.handleDetail(data.detail);
        return response
    }
}

module.exports = FileService;