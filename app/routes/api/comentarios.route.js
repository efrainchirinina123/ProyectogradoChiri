const express = require('express');
const router = express.Router();

const comentarioscontroller = require('../../controllers/api/comentarioscontroller');

router.get('/', comentarioscontroller.index);
router.post('/', comentarioscontroller.create);
router.put('/:id', comentarioscontroller.update);
router.get('/:id', comentarioscontroller.show);
router.delete('/:id', comentarioscontroller.delete);

module.exports = router;
