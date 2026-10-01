import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 text-white flex flex-col">
      <nav className="flex justify-between items-center p-6 max-w-5xl mx-auto w-full">
        <span className="text-xl font-bold">MoneyFlow</span>
        <div className="flex gap-4">
          <Link to="/login" className="px-4 py-2 rounded hover:bg-white/10 transition-colors">
            Entrar
          </Link>
          <Link
            to="/cadastro"
            className="px-4 py-2 rounded bg-white text-blue-700 font-semibold hover:bg-gray-100 transition-colors"
          >
            Criar conta
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-2xl">
          Controle suas finanças com clareza
        </h1>
        <p className="text-lg text-blue-100 mb-8 max-w-xl">
          Acompanhe receitas, despesas e metas em um só lugar. Simples, rápido e gratuito.
        </p>
        <Link
          to="/cadastro"
          className="px-8 py-3 rounded-lg bg-white text-blue-700 font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
        >
          Começar agora
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full p-6 pb-16">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="font-semibold mb-2 text-lg">Relatórios visuais</h3>
          <p className="text-sm text-blue-100">
            Veja seus gastos por categoria em gráficos claros.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="font-semibold mb-2 text-lg">Metas de gastos</h3>
          <p className="text-sm text-blue-100">
            Defina limites por categoria e acompanhe o progresso.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h3 className="font-semibold mb-2 text-lg">Seguro</h3>
          <p className="text-sm text-blue-100">
            Seus dados protegidos com autenticação JWT.
          </p>
        </div>
      </div>
    </div>
  );
}