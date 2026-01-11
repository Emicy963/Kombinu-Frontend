import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { useAuth } from '../contexts/AuthContext';
import { dashboardService, DashboardStats, EnrolledCourse } from '../services/dashboardService';
import { Trophy, BookOpen, Target, TrendingUp, Calendar, Award, Star, Zap } from 'lucide-react';

export default function DashboardAprendiz() {
  const { usuario } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await dashboardService.getLearnerStats();
        const coursesData = await dashboardService.getEnrolledCourses();
        setStats(statsData);
        setEnrolledCourses(coursesData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Olá, {usuario?.nome}! 🚀
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Continue sua jornada de aprendizado e conquiste novos objetivos
            </p>
          </div>
          
          <Link
            to="/courses"
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-800 transition-all transform hover:scale-105 flex items-center space-x-2 shadow-lg"
          >
            <BookOpen className="w-5 h-5" />
            <span>Explorar Conteúdos</span>
          </Link>
        </div>

        {/* Estatísticas do Usuário */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Trophy className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Nível</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.currentLevel}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pontos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalPoints.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Award className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Concluídos</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.coursesCompleted}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Quizzes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.quizzesTaken}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progresso Recente */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Em Progresso</h2>
            </div>
            
            <div className="p-6">
              {enrolledCourses.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Comece sua jornada de aprendizado
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Explore o marketplace e encontre conteúdos incríveis para aprender!
                  </p>
                  <Link
                    to="/courses"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Explorar Cursos</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <div key={course.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <img 
                            src={course.thumbnail} 
                            alt={course.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                              {course.title}
                            </h3>
                            <div className="w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {course.progress}% completo • Último acesso: {new Date(course.lastAccessed).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <Link
                          to={`/courses/${course.id}`}
                          className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                        >
                          Continuar
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar com Rankings e Conquistas */}
          <div className="space-y-6">
            {/* Próximo Nível */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Próximo Nível</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Nível {stats?.currentLevel}</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{stats?.totalPoints} pts</span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full relative"
                    style={{ width: '75%' }}
                  >
                    <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full"></div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Faltam 250 pontos para o nível {stats ? stats.currentLevel + 1 : 1}
                </p>
              </div>
            </div>

            {/* Link para Rankings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rankings</h3>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Veja sua posição nos rankings globais e compita com outros aprendizes!
              </p>
              
              <Link
                to="/ranking"
                className="w-full bg-yellow-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors text-center block"
              >
                Ver Rankings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}