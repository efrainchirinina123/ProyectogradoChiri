const { ofertas } = require('../models/index'); // Asegúrate de que 'ofertas' coincida con el nombre exportado
const Filter = require('../utils/filter');
const { InternalServer, NotFoundResponse, Successful } = require('../utils/response');

module.exports = {
    async create(body) {
        try {
            console.log(body)
            const response = await ofertas.create(body);
            return Successful('Item Registrado', response);
        } catch (error) {
            console.error(error); // Usa console.error para errores
            return InternalServer('Error en el servidor');
        }
    },

    async index(params = {}) { // Usa un objeto en lugar de un array por defecto
        try {
            let response = await ofertas.findAll(); // Encuentra todos los ofertas

            if (Object.keys(params).length > 0) {
                response = await Filter.applyFilter(params, ofertas);
            }

            return Successful(
                'Operación Exitosa',
                response.map((item) => item.fromDataModel())
            );
        } catch (error) {
            console.error(error); // Usa console.error para errores
            return InternalServer('Error en el servidor');
        }
    },

    async show(id) {
        try {
            const response = await ofertas.findOne({
                where: { id: id },
            });
            if (!response) return NotFoundResponse(`Producto con el id: ${id} no existe.`);
            return Successful('Operación Exitosa', response.fromDataModel());
        } catch (error) {
            console.error(error); // Usa console.error para errores
            return InternalServer('Error en el servidor');
        }
    },

    async update(id, body) {
        try {
            const response = await ofertas.findOne({
                where: { id: id },
            });
            if (!response) return NotFoundResponse(`Producto con el id: ${id} no existe.`);
            await ofertas.update(body, {
                where: { id: id },
            });

            return Successful('Registro actualizado', []);
        } catch (error) {
            console.error(error); // Usa console.error para errores
            return InternalServer('Error en el servidor');
        }
    },

    async delete(id) {
        try {
            const response = await ofertas.findOne({
                where: { id: id },
            });

            if (!response)
                return NotFoundResponse(`El producto con el id: ${id} que solicitas no existe`);

            await ofertas.destroy({
                where: { id: id },
            });
            return Successful('Registro eliminado', []);
        } catch (error) {
            console.error(error); // Usa console.error para errores
            return InternalServer('Error en el servidor');
        }
    },
};
