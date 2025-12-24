import { BookOpen, Clock, Eye, Heart, Search, User } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../contexts/DataContext';

export default function Marketplace() {
  const { conteudos } = useData();
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [dificuldadeFiltro, setDificuldadeFiltro] = useState('');

  // Filtrar apenas conteúdos públicos
  const conteudosPublicos = conteudos.filter(c => c.publico);

  // Aplicar filtros
  const conteudosFiltrados = conteudosPublicos.filter(conteudo => {
    const matchBusca = conteudo.titulo.toLowerCase().includes(busca.toLowerCase()) ||
                     conteudo.descricao.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria = !categoriaFiltro || conteudo.categoria === categoriaFiltro;
    const matchTipo = !tipoFiltro || conteudo.tipo === tipoFiltro;
    const matchDificuldade = !dificuldadeFiltro || conteudo.dificuldade === dificuldadeFiltro;
    
    return matchBusca && matchCategoria && matchTipo && matchDificuldade;
  });

  // Obter categorias únicas
  const categorias = [...new Set(conteudosPublicos.map(c => c.categoria))];

  const getDificuldadeColor = (dificuldade: string) => {
    switch (dificuldade) {
      case 'facil': return 'bg-green-100 text-green-800';
      case 'medio': return 'bg-yellow-100 text-yellow-800';
      case 'dificil': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDificuldadeText = (dificuldade: string) => {
    switch (dificuldade) {
      case 'facil': return 'Fácil';
      case 'medio': return 'Médio';
      case 'dificil': return 'Difícil';
      default: return dificuldade;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Marketplace de Conteúdos
          </h1>
          <p className="text-gray-600">
            Descubra conteúdos incríveis criados pela comunidade KOMBINU
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Busca */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar conteúdos..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtro de Categoria */}
            <div>
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas as categorias</option>
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>

            {/* Filtro de Tipo */}
            <div>
              <select
                value={tipoFiltro}
                onChange={(e) => setTipoFiltro(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos os tipos</option>
                <option value="texto">Texto</option>
                <option value="video">Vídeo</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>

            {/* Filtro de Dificuldade */}
            <div>
              <select
                value={dificuldadeFiltro}
                onChange={(e) => setDificuldadeFiltro(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas as dificuldades</option>
                <option value="facil">Fácil</option>
                <option value="medio">Médio</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-4">
          <p className="text-gray-600">
            {conteudosFiltrados.length} conteúdo{conteudosFiltrados.length !== 1 ? 's' : ''} encontrado{conteudosFiltrados.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Lista de Conteúdos */}
        {conteudosFiltrados.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Nenhum conteúdo encontrado
            </h3>
            <p className="text-gray-600">
              Tente alterar os filtros ou criar novos conteúdos
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conteudosFiltrados.map((conteudo) => (
              <div key={conteudo.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Header do Card */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {conteudo.titulo}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                        {conteudo.descricao}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      conteudo.tipo === 'quiz' ? 'bg-blue-100 text-blue-800' : 
                      conteudo.tipo === 'video' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {conteudo.tipo === 'quiz' ? 'Quiz' : 
                       conteudo.tipo === 'video' ? 'Vídeo' : 'Texto'}
                    </span>
                    
                    <span className={`px-2 py-1 text-xs rounded-full ${getDificuldadeColor(conteudo.dificuldade)}`}>
                      {getDificuldadeText(conteudo.dificuldade)}
                    </span>
                    
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {conteudo.categoria}
                    </span>
                  </div>
                </div>

                {/* Footer do Card */}
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{conteudo.visualizacoes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{conteudo.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{conteudo.tempoEstimado}min</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-yellow-400 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-600">{conteudo.criadorNome}</span>
                    </div>

                    <Link
                      to={`/conteudo/${conteudo.id}`}
                      className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-800 transition-all transform hover:scale-105"
                    >
                      Acessar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}