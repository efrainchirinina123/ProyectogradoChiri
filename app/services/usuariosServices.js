const { usuarios } = require('../models/index'); // Solo importamos el modelo 'usuarios'
const Filter = require('../utils/filter');
const { InternalServer, NotFoundResponse, Successful } = require('../utils/response');

module.exports = {
    async create(body) {
        try {
            const response = await usuarios.create(body);
            return Successful('Item Registrado', response);
        } catch (error) {
            console.log(error);
            return InternalServer('Error en el servidor');
        }
    },

    async index(params = []) {
        try {
            let response = await usuarios.findAll({});

            if (Object.keys(params).length > 0) {
                response = await Filter.applyFilter(params, usuarios);
            }

            return Successful(
                'Operación Exitosa',
                response.map((item) => item.fromDataModel())
            );
        } catch (error) {
            console.log(error);
            return InternalServer('Error en el servidor');
        }
    },

    async show(id) {
        try {
            const response = await usuarios.findOne({
                where: { id: id }
                // Eliminado el include ya que no usamos asociaciones
            });

            if (!response) return NotFoundResponse(`Usuario con el id: ${id} no existe.`);
            return Successful('Operación Exitosa', response);
        } catch (error) {
            console.log(error);
            return InternalServer('Error en el servidor');
        }
    },

    async update(id, body) {
        try {
            const response = await usuarios.findOne({
                where: { id: id }
            });

            if (!response) return NotFoundResponse(`Usuario con el id: ${id} no existe.`);
            await usuarios.update(body, {
                where: { id: id }
            });

            return Successful('Registro actualizado', []);
        } catch (error) {
            console.log(error);
            return InternalServer('Error en el servidor');
        }
    },

    async delete(id) {
        try {
            const response = await usuarios.findOne({
                where: { id: id }
            });

            if (!response)
                return NotFoundResponse(`El usuario con el id: ${id} no existe.`);

            await usuarios.destroy({
                where: { id: id }
            });

            return Successful('Registro eliminado', []);
        } catch (error) {
            console.log(error);
            return InternalServer('Error en el servidor');
        }
    }
};
