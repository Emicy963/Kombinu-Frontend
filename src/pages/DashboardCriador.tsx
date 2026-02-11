import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, Eye, Heart, Plus, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { useAuth } from '../contexts/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { contentService, Content } from '../services/contentService';

export default function DashboardCriador() {
  const { usuario } = useAuth();
  const [meusConteudos, setMeusConteudos] = useState<Content[]>([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    averageRating: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!usuario?.id) return;
      try {
        setLoading(true);
        const [statsData, contentsData] = await Promise.all([
          dashboardService.getCreatorStats(),
          contentService.getByCreator(usuario.id)
        ]);
        setStats(statsData);
        setMeusConteudos(contentsData);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [usuario?.id]);
  
  const totalVisualizacoes = stats.totalStudents;
  const totalLikes = 0;
  const conteudosPublicos = meusConteudos.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Olá, {usuario?.nome}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Gerencie seus conteúdos e acompanhe o desempenho
            </p>
          </div>
          
          <Link
            to="/courses/create"
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors transform hover:scale-105 flex items-center space-x-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Criar Conteúdo</span>
          </Link>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conteúdos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{meusConteudos.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Visualizações</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalVisualizacoes.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
                <Heart className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Curtidas</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalLikes.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Publicados</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{conteudosPublicos}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdos Recentes */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Seus Conteúdos</h2>
          </div>
          
          <div className="p-6">
            {meusConteudos.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Nenhum conteúdo criado ainda
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Crie seu primeiro conteúdo gamificado e comece a engajar sua audiência!
                </p>
                <Link
                  to="/courses/create"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Criar Primeiro Conteúdo</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {meusConteudos.map((conteudo) => (
                  <div key={conteudo.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-900/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {conteudo.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`}>
                            Público
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            conteudo.has_quiz ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                          }`}>
                            {conteudo.has_quiz ? 'Quiz' : 'Conteúdo'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                          {conteudo.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{conteudo.students || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{conteudo.rating || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(conteudo.created_at || new Date()).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Link
                          to={`/courses/${conteudo.id}`}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
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
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Dicas para melhorar seu conteúdo
                </h3>
                <ul className="text-gray-700 dark:text-gray-300 space-y-1">
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