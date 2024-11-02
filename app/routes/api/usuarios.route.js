const express = require('express');
const router = express.Router();

const usuariosController = require('../../controllers/api/usuariosController');

router.get('/', usuariosController.index);
router.post('/', usuariosController.create);
router.put('/:id', usuariosController.update);
router.get('/:id', usuariosController.show);
router.delete('/:id', usuariosController.delete);

module.exports = router;
