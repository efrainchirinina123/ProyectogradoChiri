const { Carritos } = require('../models/index'); // Asegúrate de que el nombre y la ruta sean correctos
const Filter = require('../utils/filter');
const { InternalServer, NotFoundResponse, BadRequest, Successful } = require('../utils/response');

module.exports = {
  async create(body) {
    try {
      const response = await Carritos.create(body);
      return Successful('Item Registrado', response);
    } catch (error) {
      console.error('Error en create:', error);
      return InternalServer('Error en el servidor');
    }
  },

  async index(params = []) {
    try {
      let response = await Carritos.findAll({});
      if (Object.keys(params).length > 0) {
        response = await Filter.applyFilter(params, Carritos);
      }
      return Successful('Operacion Exitosa', response.map((item) => item.fromDataModel()));
    } catch (error) {
      console.error('Error en index:', error);
      return InternalServer('Error en el servidor');
    }
  },

  async show(id) {
    try {
      const response = await Carritos.findOne({
        where: { id: id },
      });
      if (!response) return NotFoundResponse(`Carrito con el id: ${id} no existe.`);
      return Successful('Operacion Exitosa', response.fromDataModel());
    } catch (error) {
      console.error('Error en show:', error);
      return InternalServer('Error en el servidor');
    }
  },

  async update(id, body) {
    try {
      const response = await Carritos.findOne({
        where: { id: id },
      });
      if (!response) return NotFoundResponse(`Carrito con el id: ${id} no existe.`);
      await Carritos.update(body, {
        where: { id: id },
      });
      return Successful('Registro actualizado', []);
    } catch (error) {
      console.error('Error en update:', error);
      return InternalServer('Error en el servidor');
    }
  },

  async delete(id) {
    try {
      const response = await Carritos.findOne({
        where: { id: id },
      });
      if (!response) return NotFoundResponse(`Carrito con el id: ${id} no existe.`);
      await Carritos.destroy({
        where: { id: id },
      });
      return Successful('Registro eliminado', []);
    } catch (error) {
      console.error('Error en delete:', error);
      return InternalServer('Error en el servidor');
    }
  },
};
