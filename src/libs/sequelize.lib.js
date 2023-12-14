const { Sequelize } = require('sequelize');

const { config } = require('../config/config');
const setupModels = require('../db/models');

const sequelize = new Sequelize(config.db.name, config.db.user, config.db.pwd, {
    host: config.db.host,
    dialect: 'mssql',
    dialectOptions: {
        options: {
            instanceName: config.db.instance
        }
    }
});

setupModels(sequelize);

module.exports = sequelize;