require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API rodando!' });
});

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);

const transacaoRoutes = require('./routes/transacaoRoutes'); app.use('/transacoes', transacaoRoutes); 

const categoriaRoutes = require('./routes/categoriaRoutes'); app.use('/categorias', categoriaRoutes);

const relatorioRoutes = require('./routes/relatorioRoutes'); app.use('/relatorios', relatorioRoutes);
});