import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Trophy, BookOpen, Target, TrendingUp, Calendar, Award, Star, Zap } from 'lucide-react';

export default function DashboardAprendiz() {
  const { usuario } = useAuth();
  const { obterProgressosUsuario, conteudos } = useData();
  
  const meusProgressos = obterProgressosUsuario(usuario?.id || '');
  const conteudosConcluidos = meusProgressos.filter(p => p.concluido).length;
  const conteudosEmAndamento = meusProgressos.filter(p => !p.concluido).length;
  const totalPontos = meusProgressos.reduce((total, p) => total + p.pontos, 0);

  // Progresso recente
  const progressosRecentes = meusProgressos
    .sort((a, b) => new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Olá, {usuario?.nome}! 🚀
            </h1>
            <p className="text-gray-600 mt-1">
              Continue sua jornada de aprendizado e conquiste novos objetivos
            </p>
          </div>
          
          <Link
            to="/marketplace"
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-800 transition-all transform hover:scale-105 flex items-center space-x-2"
          >
            <BookOpen className="w-5 h-5" />
            <span>Explorar Conteúdos</span>
          </Link>
        </div>

        {/* Estatísticas do Usuário */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <Trophy className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nível</p>
                <p className="text-2xl font-bold text-gray-900">{usuario?.nivel}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pontos</p>
                <p className="text-2xl font-bold text-gray-900">{usuario?.pontos.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Concluídos</p>
                <p className="text-2xl font-bold text-gray-900">{conteudosConcluidos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Progresso</p>
                <p className="text-2xl font-bold text-gray-900">{conteudosEmAndamento}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progresso Recente */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Atividade Recente</h2>
            </div>
            
            <div className="p-6">
              {progressosRecentes.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Comece sua jornada de aprendizado
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Explore o marketplace e encontre conteúdos incríveis para aprender!
                  </p>
                  <Link
                    to="/marketplace"
                    className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-800 transition-all transform hover:scale-105 inline-flex items-center space-x-2"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>Explorar Marketplace</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {progressosRecentes.map((progresso) => {
                    const conteudo = conteudos.find(c => c.id === progresso.conteudoId);
                    if (!conteudo) return null;
                    
                    return (
                      <div key={`${progresso.usuarioId}-${progresso.conteudoId}`} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="text-lg font-medium text-gray-900">
                                {conteudo.titulo}
                              </h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                progresso.concluido 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-blue-100 text-blue-800'
                              }`}>
                                {progresso.concluido ? 'Concluído' : 'Em Progresso'}
                              </span>
                            </div>
                            
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-blue-700 h-2 rounded-full" 
                                style={{ width: `${progresso.progresso}%` }}
                              ></div>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Target className="w-4 h-4" />
                                <span>{progresso.progresso}% completo</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4" />
                                <span>{progresso.pontos} pontos</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(progresso.dataInicio).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          
                          <Link
                            to={`/conteudo/${conteudo.id}`}
                            className="ml-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            {progresso.concluido ? 'Revisar' : 'Continuar'}
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar com Rankings e Conquistas */}
          <div className="space-y-6">
            {/* Próximo Nível */}
            <div className="bg-gradient-to-br from-blue-50 to-yellow-50 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Próximo Nível</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Nível {usuario?.nivel}</span>
                  <span className="text-gray-600">Nível {(usuario?.nivel || 1) + 1}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-yellow-500 h-3 rounded-full" 
                    style={{ 
                      width: `${((usuario?.pontos || 0) % 1000) / 10}%` 
                    }}
                  ></div>
                </div>
                
                <p className="text-sm text-gray-600">
                  Faltam {1000 - ((usuario?.pontos || 0) % 1000)} pontos para o próximo nível
                </p>
              </div>
            </div>

            {/* Link para Rankings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Rankings</h3>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">
                Veja sua posição nos rankings globais e compita com outros aprendizes!
              </p>
              
              <Link
                to="/ranking"
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-700 text-white px-4 py-3 rounded-lg font-medium hover:from-yellow-600 hover:to-yellow-800 transition-all text-center block"
              >
                Ver Rankings
              </Link>
            </div>

            {/* Motivação */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💪 Frase do Dia</h3>
              <p className="text-gray-700 italic">
                "O sucesso é a soma de pequenos esforços repetidos dia após dia."
              </p>
              <p className="text-sm text-gray-500 mt-2">- Robert Collier</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}