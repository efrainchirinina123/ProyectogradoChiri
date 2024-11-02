'use strict';

const { Recibos, Productos } = require('../models/index');
const Filter = require('../utils/filter');
const { InternalServer, NotFoundResponse, BadRequest, Successful } = require('../utils/response');

module.exports = {
    async create(body) {
        try {
            const response = await Recibos.create(body, {
                include: [
                    {
                        model: Productos,
                        as: 'productos'  // Usa el alias definido en la asociación
                    }
                ]
            });

            return Successful('Item Registrado', response);
        } catch (error) {
            console.error(error);
            return InternalServer('Error en el servidor');
        }
    },

    async index(params = []) {
        try {
            let response = await Recibos.findAll({
                include: [
                    {
                        model: Productos,
                        as: 'productos'  // Usa el alias definido en la asociación
                    }
                ]
            });

            if (Object.keys(params).length > 0) {
                response = await Filter.applyFilter(params, Recibos);
            }

            return Successful(
                'Operación Exitosa',
                response.map((item) => item.fromDataModel())
            );
        } catch (error) {
            console.error(error);
            return InternalServer('Error en el servidor');
        }
    },

    async show(id) {
        try {
            const response = await Recibos.findOne({
                where: { id: id },
                include: [
                    {
                        model: Productos,
                        as: 'productos'  // Usa el alias definido en la asociación
                    }
                ]
            });

            if (!response) return NotFoundResponse(`Recibo con el id: ${id} no existe.`);
            return Successful('Operación Exitosa', response.fromDataModel());
        } catch (error) {
            console.error(error);
            return InternalServer('Error en el servidor');
        }
    },

    async update(id, body) {
        try {
            const response = await Recibos.findOne({ where: { id: id } });

            if (!response) return NotFoundResponse(`Recibo con el id: ${id} no existe.`);
            
            // Update the record
            await response.update(body);

            return Successful('Registro actualizado', response.fromDataModel());
        } catch (error) {
            console.error(error);
            return InternalServer('Error en el servidor');
        }
    },

    async delete(id) {
        try {
            const response = await Recibos.findOne({
                where: { id: id }
            });

            if (!response) return NotFoundResponse(`Recibo con el id: ${id} no existe.`);

            await Recibos.destroy({
                where: { id: id }
            });

            return Successful('Registro eliminado', []);
        } catch (error) {
            console.error(error);
            return InternalServer('Error en el servidor');
        }
    },
};
