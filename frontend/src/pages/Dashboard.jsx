import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const CORES = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Dashboard() {
  const [transacoes, setTransacoes] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [resumo, setResumo] = useState({});
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [novoTipo, setNovoTipo] = useState('despesa');
  const [busca, setBusca] = useState('');
  const [mesFiltro, setMesFiltro] = useState('');
  const navigate = useNavigate();

  async function carregarTudo() {
    try {
      const [resTransacoes, resCategorias, resResumo] = await Promise.all([
        api.get('/transacoes'),
        api.get('/categorias'),
        api.get('/relatorios/resumo'),
      ]);
      setTransacoes(resTransacoes.data);
      setCategorias(resCategorias.data);
      setResumo(resResumo.data);
    } catch {
      navigate('/login');
    }
  }

  useEffect(() => { carregarTudo(); }, []);

  function limparFormulario() {
    setDescricao(''); setValor(''); setData(''); setCategoriaId(''); setEditandoId(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      descricao,
      valor: Number(valor),
      data,
      categoriaId: categoriaId ? Number(categoriaId) : null,
    };
    if (editandoId) {
      await api.put(`/transacoes/${editandoId}`, payload);
    } else {
      await api.post('/transacoes', payload);
    }
    limparFormulario();
    carregarTudo();
  }

  function editarTransacao(t) {
    setEditandoId(t.id);
    setDescricao(t.descricao || '');
    setValor(t.valor);
    setData(t.data.slice(0, 10));
    setCategoriaId(t.categoriaId || '');
  }

  async function excluirTransacao(id) {
    if (!confirm('Tem certeza que deseja excluir essa transação?')) return;
    await api.delete(`/transacoes/${id}`);
    carregarTudo();
  }

  async function criarCategoria(e) {
    e.preventDefault();
    if (!novaCategoria) return;
    await api.post('/categorias', { nome: novaCategoria, tipo: novoTipo });
    setNovaCategoria('');
    carregarTudo();
  }

  function sair() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  const dadosGrafico = Object.entries(resumo).map(([nome, valor]) => ({ nome, valor }));

  const saldo = transacoes.reduce((total, t) => {
    const tipo = t.categoria?.tipo || 'despesa';
    return tipo === 'receita' ? total + Number(t.valor) : total - Number(t.valor);
  }, 0);

  const transacoesFiltradas = transacoes.filter((t) => {
    const bateBusca = t.descricao?.toLowerCase().includes(busca.toLowerCase());
    const bateMes = mesFiltro ? t.data.slice(0, 7) === mesFiltro : true;
    return bateBusca && bateMes;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">MoneyFlow</h1>
        <div className="flex items-center gap-4">
          <Link to="/categorias" className="text-blue-600">Categorias</Link>
          <button onClick={sair} className="text-red-600">Sair</button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg shadow p-6 mb-6 text-white ${saldo >= 0 ? 'bg-green-600' : 'bg-red-600'}`}
      >
        <p className="text-sm opacity-90">Saldo total</p>
        <p className="text-3xl font-bold">{formatarMoeda(saldo)}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">{editandoId ? 'Editar transação' : 'Nova transação'}</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full border rounded px-3 py-2" />
            <input type="number" step="0.01" placeholder="Valor" value={valor} onChange={(e) => setValor(e.target.value)} className="w-full border rounded px-3 py-2" />
            <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="w-full border rounded px-3 py-2" />
            <select value={categoriaId} onChange={(e) => setCategoriaId(e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="">Sem categoria</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <motion.button whileTap={{ scale: 0.97 }} type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                {editandoId ? 'Salvar alterações' : 'Adicionar'}
              </motion.button>
              {editandoId && (
                <button type="button" onClick={limparFormulario} className="px-4 py-2 rounded border">
                  Cancelar
                </button>
              )}
            </div>
          </form>

          <form onSubmit={criarCategoria} className="flex gap-2 mt-4 pt-4 border-t">
            <input placeholder="Nova categoria" value={novaCategoria} onChange={(e) => setNovaCategoria(e.target.value)} className="flex-1 border rounded px-3 py-2 text-sm" />
            <select value={novoTipo} onChange={(e) => setNovoTipo(e.target.value)} className="border rounded px-2 py-2 text-sm">
              <option value="despesa">Despesa</option>
              <option value="receita">Receita</option>
            </select>
            <button type="submit" className="bg-gray-200 px-3 rounded text-sm">+</button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Gastos por categoria</h2>
          {dadosGrafico.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={dadosGrafico} dataKey="valor" nameKey="nome" outerRadius={90} label>
                  {dadosGrafico.map((_, i) => <Cell key={i} fill={CORES[i % CORES.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400">Nenhuma transação ainda.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mt-6">
        <h2 className="font-semibold mb-3">Transações</h2>

        <div className="flex gap-2 mb-3">
          <input
            placeholder="Buscar por descrição..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 border rounded px-3 py-2 text-sm"
          />
          <input
            type="month"
            value={mesFiltro}
            onChange={(e) => setMesFiltro(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />
        </div>

        {transacoesFiltradas.length === 0 && (
          <p className="text-gray-400 text-sm">Nenhuma transação encontrada.</p>
        )}

        <AnimatePresence>
          {transacoesFiltradas.map((t) => {
            const tipo = t.categoria?.tipo || 'despesa';
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.2 }}
                className="flex justify-between items-center py-2 border-b"
              >
                <span>{t.descricao} {t.categoria ? `(${t.categoria.nome})` : ''}</span>
                <div className="flex items-center gap-3">
                  <span className={tipo === 'receita' ? 'text-green-600' : 'text-red-600'}>
                    {tipo === 'receita' ? '+' : '-'} {formatarMoeda(t.valor)}
                  </span>
                  <button onClick={() => editarTransacao(t)} className="text-blue-600 text-sm">Editar</button>
                  <button onClick={() => excluirTransacao(t.id)} className="text-red-600 text-sm">Excluir</button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}