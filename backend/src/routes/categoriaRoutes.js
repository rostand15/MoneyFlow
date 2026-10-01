const express = require('express');
const router = express.Router();

const verificarToken = require('../middlewares/authMiddleware');
const { listar, criar, remover, atualizar } = require('../controllers/categoriaController');

// Aplica o middleware de autenticação em todas as rotas abaixo
router.use(verificarToken);

router.get('/', listar);
router.post('/', criar);
router.delete('/:id', remover);
router.put('/:id' , atualizar);


module.exports = router;