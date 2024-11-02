const express = require('express');
const router = express.Router();

const productosController = require('../../controllers/api/productosController');

router.get('/', productosController.index);
router.post('/', productosController.create); // Eliminamos upload.single('imagen')
router.put('/:id', productosController.update); // Eliminamos upload.single('imagen')
router.get('/:id', productosController.show);
router.delete('/:id', productosController.delete);

module.exports = router;
