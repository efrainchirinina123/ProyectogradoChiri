'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Pagos extends Model {
       

        fromDataModel() {
            return {
                id: this.id,
                metodopago: this.metodopago,
                reciboId: this.reciboId,
                monto: this.monto,
            
            };
        }
    }

    Pagos.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        metodopago: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        reciboId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'recibos',
                key: 'id',
            },
        },
        monto: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
      
    }, {
        sequelize,
        modelName: 'pagos',
        tableName: 'pagos',
        timestamps: true,
    });

    return Pagos;
};
