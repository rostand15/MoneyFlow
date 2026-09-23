const express = require('express');
const router = express.Router();

const verificarToken = require('../middlewares/authMiddleware');
const { resumoPorCategoria } = require('../controllers/relatorioController');

// Aplica o middleware de autenticação na rota de relatórios
router.use(verificarToken);

router.get('/resumo', resumoPorCategoria);

module.exports = router;