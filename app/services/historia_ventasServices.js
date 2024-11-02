const { HistoriaVentas } = require('../models/index'); // Asegúrate de que la ruta sea correcta
const Filter = require('../utils/filter');
const { InternalServer, NotFoundResponse, Successful } = require('../utils/response');

module.exports = {
    async create(body) {
        try {
            const response = await HistoriaVentas.create(body);
            return Successful('Item Registrado', response);
        } catch (error) {
            console.log(error);
            return InternalServer('Error en el servidor');
        }
    },

    async index(params = []) {
        try {
            let response = await HistoriaVentas.findAll();

            if (Object.keys(params).length > 0) {
                response = await Filter.applyFilter(params, HistoriaVentas);
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
            const response = await HistoriaVentas.findOne({
                where: { id: id },
            });
            if (!response) return NotFoundResponse(`Item con el id: ${id} no existe.`);
            return Successful('Operación Exitosa', response.fromDataModel());
        } catch (error) {
            console.log(error);
            return InternalServer('Error en el servidor');
        }
    },

    async update(id, body) {
        try {
            const response = await HistoriaVentas.findOne({
                where: { id: id },
            });
            if (!response) return NotFoundResponse(`Item con el id: ${id} no existe.`);
            await HistoriaVentas.update(body, {
                where: { id: id },
            });

            return Successful('Registro actualizado', []);
        } catch (error) {
            console.log(error);
            return InternalServer('Error en el servidor');
        }
    },

    async delete(id) {
        try {
            const response = await HistoriaVentas.findOne({
                where: { id: id },
            });

            if (!response)
                return NotFoundResponse(`El item con el id: ${id} no existe`);

            await HistoriaVentas.destroy({
                where: { id: id },
            });
            return Successful('Registro eliminado', []);
        } catch (error) {
            console.log(error);
            return InternalServer('Error en el servidor');
        }
    },
};
