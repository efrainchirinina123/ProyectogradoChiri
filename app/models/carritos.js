'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Carritos extends Model {
    fromDataModel() {
      return {
        id: this.id,
        productos_id: this.productos_id,
        precio: this.precio,
        nombre: this.nombre,
      };
    }
  }

  Carritos.init({
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
    
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    precio: {
      type: DataTypes.BIGINT, // Ajusta el tipo según lo que necesites
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(50), // Ajusta el tipo y tamaño según tu base de datos
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Carritos',
    tableName: 'carritos',
    timestamps: true,
  });

  return Carritos;
};
