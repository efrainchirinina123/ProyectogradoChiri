'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Productos extends Model {
        static associate(models) {
            Productos.hasMany(models.HistoriaVentas, {
                foreignKey: 'productos_id',
                as: 'historiaVentas'
            });
            Productos.hasMany(models.Recibos, {
                foreignKey: 'productos_id',
                as: 'recibos'
            });
        }

        fromDataModel() {
            return {
                id: this.id,
                imagen: this.imagen, // Aquí se almacena el identificador único de la imagen
                nombre: this.nombre,
                precio: this.precio,
                descripcion: this.descripcion,
            };
        }
    }

    Productos.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        precio: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imagen: {
            type: DataTypes.STRING, // Almacena el identificador único de la imagen
            allowNull: true,
        },
    }, {
        sequelize,
        modelName: 'Productos',
        tableName: 'productos',
        timestamps: false,
    });

    return Productos;
};
