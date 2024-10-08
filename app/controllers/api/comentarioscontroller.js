const comentariosServices = require('../../services/comentariosServices');

module.exports = {
	async index(req, res) {
		const response = await comentariosServices.index(req.query);
		res.status(200).json(response);
	},
	async show(req, res) {
		const {id} = req.params;
		const response = await comentariosServices.show(id);
		res.status(200).json(response);
	},
	async create(req, res) {
		const {body} = req;

		const response = await comentariosServices.create(body);
		res.status(200).json(response);
	},
	async update(req, res) {
		const {id} = req.params;
		const {body} = req;
		const response = await comentariosServices.update(id, body);
		res.status(200).json(response);
	},
	async delete(req, res) {
		const {id} = req.params;
		const response = await comentariosServices.delete(id);
		res.status(200).json(response);
	},

	// * VIEWS
	// async listView(req, res) {
	// 	res.render('home/tipo_cursos');
	// },
};
