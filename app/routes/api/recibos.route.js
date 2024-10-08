const express = require('express');
const router = express.Router();

const reciboscontroller = require('../../controllers/api/recibosController');

router.get('/', reciboscontroller.index);
router.post('/', reciboscontroller.create);
router.put('/:id', reciboscontroller.update);
router.get('/:id', reciboscontroller.show);
router.delete('/:id', reciboscontroller.delete);

module.exports = router;
