const { Consecutive, ConsecutiveSchema, CONSECUTIVE_TABLE } = require('./consecutive.model');

function setupModels(sequelize) {
    Consecutive.init(ConsecutiveSchema, Consecutive.config(sequelize));
}

module.exports = setupModels;