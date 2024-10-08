'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Recibos extends Model {
        static associate(models) {
            // Define la asociación con HistoriaVentas
            // Recibos.belongsTo(models.HistoriaVentas, {
            //     foreignKey: 'historiaVentasId',
            //     as: 'historiaVentas'
            // });
            // Define la asociación con Productos
            Recibos.belongsTo(models.Productos, {
                foreignKey: 'productos_id',
                as: 'productos'
            });
        }

        fromDataModel() {
            return {
                id: this.id,
                fecha: this.fecha,
                total: this.total,
                metodopago: this.metodopago,
                // historiaVentasId: this.historiaVentasId,
                productos_id: this.productos_id
            };
        }
    }

    Recibos.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        total: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        metodopago: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // historiaVentasId: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: 'historia_ventas',
        //         key: 'id',
        //     }
        // },
        productos_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'productos',
                key: 'id',
            }
        }
    }, {
        sequelize,
        modelName: 'Recibos',
        tableName: 'recibos',
        timestamps: false,
    });

    return Recibos;
};
