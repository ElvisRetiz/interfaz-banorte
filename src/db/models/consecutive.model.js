const { Model, DataTypes, Sequelize } = require('sequelize');

const CONSECUTIVE_TABLE = 'KIT_Banorte_Consecutivos';

const ConsecutiveSchema = {
    consecutivo: {
        primaryKey: true,
        allowNull: false,
        type: DataTypes.INTEGER
    },
    fecha: {
        allowNull: false,
        type: DataTypes.DATE
    }
}

class Consecutive extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: CONSECUTIVE_TABLE,
            modelName: 'Consecutive',
            timestamps: false
        }
    }
}

module.exports = { Consecutive, ConsecutiveSchema, CONSECUTIVE_TABLE }