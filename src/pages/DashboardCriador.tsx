import { BookOpen, Calendar, Eye, Heart, Plus, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

export default function DashboardCriador() {
  const { usuario } = useAuth();
  const { obterConteudosPorCriador } = useData();
  
  const meusConteudos = obterConteudosPorCriador(usuario?.id || '');
  
  const totalVisualizacoes = meusConteudos.reduce((total, conteudo) => total + conteudo.visualizacoes, 0);
  const totalLikes = meusConteudos.reduce((total, conteudo) => total + conteudo.likes, 0);
  const conteudosPublicos = meusConteudos.filter(c => c.publico).length;

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Olá, {usuario?.nome}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Gerencie seus conteúdos e acompanhe o desempenho
            </p>
          </div>
          
          <Link
            to="/criar-conteudo"
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-800 transition-all transform hover:scale-105 flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Criar Conteúdo</span>
          </Link>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conteúdos</p>
                <p className="text-2xl font-bold text-gray-900">{meusConteudos.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Visualizações</p>
                <p className="text-2xl font-bold text-gray-900">{totalVisualizacoes.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Curtidas</p>
                <p className="text-2xl font-bold text-gray-900">{totalLikes.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Publicados</p>
                <p className="text-2xl font-bold text-gray-900">{conteudosPublicos}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdos Recentes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Seus Conteúdos</h2>
          </div>
          
          <div className="p-6">
            {meusConteudos.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum conteúdo criado ainda
                </h3>
                <p className="text-gray-600 mb-6">
                  Crie seu primeiro conteúdo gamificado e comece a engajar sua audiência!
                </p>
                <Link
                  to="/criar-conteudo"
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-800 transition-all transform hover:scale-105 inline-flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Criar Primeiro Conteúdo</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {meusConteudos.map((conteudo) => (
                  <div key={conteudo.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {conteudo.titulo}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            conteudo.publico 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {conteudo.publico ? 'Público' : 'Rascunho'}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            conteudo.tipo === 'quiz' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                          }`}>
                            {conteudo.tipo === 'quiz' ? 'Quiz' : 'Conteúdo'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {conteudo.descricao}
                        </p>
                        
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
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(conteudo.dataCriacao).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          to={`/conteudo/${conteudo.id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Ver
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dicas para Criadores */}
        {meusConteudos.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-yellow-50 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Dicas para melhorar seu conteúdo
                </h3>
                <ul className="text-gray-700 space-y-1">
                  <li>• Adicione quizzes interativos para aumentar o engajamento</li>
                  <li>• Use descrições claras e atrativas</li>
                  <li>• Categorize seu conteúdo adequadamente</li>
                  <li>• Responda aos comentários e feedback dos aprendizes</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}