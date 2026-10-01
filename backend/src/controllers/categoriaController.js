const prisma = require('../config/prisma');

async function listar(req, res) {
  try {
    const categorias = await prisma.categoria.findMany({
      where: { usuarioId: req.usuarioId }
    });

    res.json(categorias);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar categorias.' });
  }
}

async function criar(req, res) {
  const { nome, tipo, metaMensal } = req.body;

  try {
    const categoria = await prisma.categoria.create({
      data: {
        nome,
        tipo,
        metaMensal: metaMensal ? Number(metaMensal) : null,
        usuarioId: req.usuarioId,
      },
    });

    res.status(201).json(categoria);
  } catch (erro) {
    res.status(400).json({ erro: 'Erro ao criar categoria.' });
  }
}

async function remover(req, res) {
  const { id } = req.params;

  try {
    await prisma.categoria.delete({
      where: { id: Number(id) }
    });

    res.status(204).send();
  } catch (erro) {
    res.status(400).json({ erro: 'Erro ao remover categoria.' });
  }
}

async function atualizar(req, res) {
  const { id } = req.params;
  const { nome, tipo, metaMensal } = req.body;

  try {
    const categoria = await prisma.categoria.update({
      where: { id: Number(id) },
      data: {
        nome,
        tipo,
        metaMensal: metaMensal ? Number(metaMensal) : null,
      },
    });

    res.json(categoria);
  } catch (erro) {
    res.status(400).json({ erro: 'Erro ao atualizar categoria.' });
  }
  
}async function atualizar(req, res) {
  const { id } = req.params;
  const { nome, tipo, metaMensal } = req.body;

  try {
    const categoria = await prisma.categoria.update({
      where: { id: Number(id) },
      data: {
        nome,
        tipo,
        metaMensal: metaMensal ? Number(metaMensal) : null,
      },
    });

    res.json(categoria);
  } catch (erro) {
    res.status(400).json({ erro: 'Erro ao atualizar categoria.' });
  }
}



module.exports = { listar, criar, remover, atualizar };