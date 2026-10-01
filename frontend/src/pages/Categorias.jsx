import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function formatarMoeda(valor) {
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('despesa');
  const [metaMensal, setMetaMensal] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const navigate = useNavigate();

  async function carregar() {
    try {
      const [resCategorias, resTransacoes] = await Promise.all([
        api.get('/categorias'),
        api.get('/transacoes'),
      ]);
      setCategorias(resCategorias.data);
      setTransacoes(resTransacoes.data);
    } catch {
      navigate('/login');
    }
  }

  useEffect(() => { carregar(); }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { nome, tipo, metaMensal: metaMensal ? Number(metaMensal) : null };
    if (editandoId) {
      await api.put(`/categorias/${editandoId}`, payload);
    } else {
      await api.post('/categorias', payload);
    }
    setNome(''); setTipo('despesa'); setMetaMensal(''); setEditandoId(null);
    carregar();
  }

  function editar(c) {
    setEditandoId(c.id);
    setNome(c.nome);
    setTipo(c.tipo);
    setMetaMensal(c.metaMensal || '');
  }

  async function excluir(id) {
    if (!confirm('Excluir essa categoria? As transações vinculadas ficarão sem categoria.')) return;
    await api.delete(`/categorias/${id}`);
    carregar();
  }

  function gastoDoMes(categoriaId) {
    const hoje = new Date();
    const mesAtual = hoje.toISOString().slice(0, 7);
    return transacoes
      .filter((t) => t.categoriaId === categoriaId && t.data.slice(0, 7) === mesAtual)
      .reduce((total, t) => total + Number(t.valor), 0);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categorias</h1>
        <Link to="/dashboard" className="text-blue-600">← Voltar ao Dashboard</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">{editandoId ? 'Editar categoria' : 'Nova categoria'}</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full border rounded px-3 py-2" />
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full border rounded px-3 py-2">
              <option value="despesa">Despesa</option>
              <option value="receita">Receita</option>
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Meta mensal (opcional)"
              value={metaMensal}
              onChange={(e) => setMetaMensal(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                {editandoId ? 'Salvar' : 'Adicionar'}
              </button>
              {editandoId && (
                <button type="button" onClick={() => { setEditandoId(null); setNome(''); setTipo('despesa'); setMetaMensal(''); }} className="px-4 py-2 rounded border">
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Suas categorias</h2>
          {categorias.length === 0 && <p className="text-gray-400 text-sm">Nenhuma categoria ainda.</p>}
          {categorias.map((c) => {
            const gasto = gastoDoMes(c.id);
            const meta = c.metaMensal ? Number(c.metaMensal) : null;
            const percentual = meta ? Math.min((gasto / meta) * 100, 100) : 0;
            const estourou = meta && gasto > meta;

            return (
              <div key={c.id} className="py-3 border-b">
                <div className="flex justify-between items-center mb-1">
                  <span>
                    {c.nome}{' '}
                    <span className={`text-xs px-2 py-0.5 rounded ${c.tipo === 'receita' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {c.tipo}
                    </span>
                  </span>
                  <div className="flex gap-3">
                    <button onClick={() => editar(c)} className="text-blue-600 text-sm">Editar</button>
                    <button onClick={() => excluir(c.id)} className="text-red-600 text-sm">Excluir</button>
                  </div>
                </div>
                {meta && (
                  <div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className={`h-2 rounded-full ${estourou ? 'bg-red-600' : 'bg-blue-600'}`}
                        style={{ width: `${percentual}%` }}
                      />
                    </div>
                    <p className={`text-xs mt-1 ${estourou ? 'text-red-600' : 'text-gray-500'}`}>
                      {formatarMoeda(gasto)} de {formatarMoeda(meta)} este mês
                      {estourou ? ' — meta ultrapassada!' : ''}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}