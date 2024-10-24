'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Comentarios extends Model {
       

        fromDataModel() {
            return {
                id: this.id,
                productos_id: this.productos_id,
                ofertas_id: this.ofertas_id,
                nombre: this.nombre,
                comentario: this.comentario,
                createdAt: this.createdAt,
                updatedAt: this.updatedAt,
            };
        }
    }

    Comentarios.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        productos_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'productos',
                key: 'id',
            },
        },
        ofertas_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'ofertas',
                key: 'id',
            },
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        
        comentario: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'comentarios',
        tableName: 'comentarios',
    });

    return Comentarios;
};
