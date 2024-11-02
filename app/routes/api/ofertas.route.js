const express = require('express');
const router = express.Router();

const ofertasController = require('../../controllers/api/ofertasController');

router.get('/', ofertasController.index);
router.post('/', ofertasController.create); // Eliminamos upload.single('imagen')
router.put('/:id', ofertasController.update); // Eliminamos upload.single('imagen')
router.get('/:id', ofertasController.show);
router.delete('/:id', ofertasController.delete);

module.exports = router;
