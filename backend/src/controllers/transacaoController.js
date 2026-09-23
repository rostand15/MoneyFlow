const prisma = require('../config/prisma');

async function listar(req, res) {
  try {
    const transacoes = await prisma.transacao.findMany({
      where: { usuarioId: req.usuarioId },
      include: { categoria: true },
      orderBy: { data: 'desc' }
    });

    res.json(transacoes);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar transações.' });
  }
}

async function criar(req, res) {
  const { descricao, valor, data, categoriaId } = req.body;

  try {
    const transacao = await prisma.transacao.create({
      data: {
        descricao,
        valor,
        data: new Date(data),
        categoriaId,
        usuarioId: req.usuarioId
      }
    });

    res.status(201).json(transacao);
  } catch (erro) {
    res.status(400).json({ erro: 'Erro ao criar transação.' });
  }
}

async function remover(req, res) {
  const { id } = req.params;

  try {
    await prisma.transacao.delete({
      where: { id: Number(id) }
    });

    res.status(204).send();
  } catch (erro) {
    res.status(400).json({ erro: 'Erro ao remover transação.' });
  }
}

async function atualizar(req, res) {
  const { id } = req.params;
  const { descricao, valor, data, categoriaId } = req.body;

  try {
    const transacao = await prisma.transacao.update({
      where: { id: Number(id) },
      data: {
        descricao,
        valor,
        data: new Date(data),
        categoriaId
      }
    });

    res.json(transacao);
  } catch (erro) {
    res.status(400).json({ erro: 'Erro ao atualizar transação.' });
  }
}


module.exports = { listar, criar, remover, atualizar };