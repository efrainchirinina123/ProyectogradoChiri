'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Usuarios extends Model {
       

        fromDataModel() {
            return {
                id: this.id,
                nombre: this.nombre,
                email: this.email,
                carritos: this.carritos ? this.carritos.map(carrito => ({
                    id: carrito.id,
                    // Otras propiedades de carrito que deseas incluir
                })) : [],    
            };
        }
    }

    Usuarios.init({
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    }, {
        sequelize,
        modelName: 'usuarios',
        tableName: 'usuarios',
        timestamps: true,
    });

    return Usuarios;
};
