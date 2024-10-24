'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class ofertas extends Model {
        static associate(models) {
            ofertas.hasMany(models.HistoriaVentas, {
                foreignKey: 'ofertas',
                as: 'historiaVentas'
            });
            ofertas.hasMany(models.Recibos, {
                foreignKey: 'ofertas',
                as: 'recibos'
            });
        }

        fromDataModel() {
            return {
                id: this.id,
                imagen: this.imagen, // Aquí se almacena el identificador único de la imagen
                nombre: this.nombre,
                descripcion: this.descripcion,
                precioantes: this.precioantes,
                precioahora: this.precioahora,
            };
        }
    }

    ofertas.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        precioahora	: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        precioantes	: {
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
        modelName: 'ofertas',
        tableName: 'ofertas',
        timestamps: false,
    });

    return ofertas;
};
