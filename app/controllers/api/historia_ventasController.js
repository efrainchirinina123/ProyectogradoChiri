const historia_ventasServices = require('../../services/historia_ventasServices');

module.exports = {
    async index(req, res) {
        try {
            const response = await historia_ventasServices.index(req.query);
            res.status(200).json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    async show(req, res) {
        try {
            const { id } = req.params;
            const response = await historia_ventasServices.show(id);
            res.status(200).json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    async create(req, res) {
        try {
            const { body } = req;
            const response = await historia_ventasServices.create(body);
            res.status(200).json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { body } = req;
            const response = await historia_ventasServices.update(id, body);
            res.status(200).json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    async delete(req, res) {
        try {
            const { id } = req.params;
            const response = await historia_ventasServices.delete(id);
            res.status(200).json(response);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    // * VIEWS
    // async listView(req, res) {
    //     res.render('home/tipo_cursos');
    // },
};
