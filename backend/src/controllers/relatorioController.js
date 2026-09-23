const prisma = require('../config/prisma');

async function resumoPorCategoria(req, res) {
  try {
    const transacoes = await prisma.transacao.findMany({
      where: { usuarioId: req.usuarioId },
      include: { categoria: true }
    });

    const resumo = {};

    for (const t of transacoes) {
      const nomeCategoria = t.categoria ? t.categoria.nome : 'Sem categoria';

      if (!resumo[nomeCategoria]) {
        resumo[nomeCategoria] = 0;
      }

      resumo[nomeCategoria] += Number(t.valor);
    }

    res.json(resumo);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao gerar resumo por categoria.' });
  }
}

module.exports = { resumoPorCategoria };