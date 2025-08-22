import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Shield, Users, BookOpen, Flag, Eye, Trash2, CheckCircle, XCircle, BarChart3, TrendingUp } from 'lucide-react';

export default function PainelAdmin() {
  const { usuario } = useAuth();
  const { conteudos, progressos } = useData();
  const [filtroConteudo, setFiltroConteudo] = useState<'todos' | 'pendentes' | 'aprovados' | 'rejeitados'>('todos');

  // Estatísticas gerais
  const totalUsuarios = 1250; // Mock data
  const totalConteudos = conteudos.length;
  const conteudosPublicos = conteudos.filter(c => c.publico).length;
  const totalVisualizacoes = conteudos.reduce((total, c) => total + c.visualizacoes, 0);

  // Conteúdos filtrados
  const conteudosFiltrados = conteudos.filter(conteudo => {
    switch (filtroConteudo) {
      case 'pendentes':
        return !conteudo.publico;
      case 'aprovados':
        return conteudo.publico;
      case 'rejeitados':
        return false; // Mock - não temos status de rejeitado ainda
      default:
        return true;
    }
  });

  const handleAprovarConteudo = (id: string) => {
    // Em uma implementação real, isso faria uma chamada para a API
    console.log('Aprovar conteúdo:', id);
  };

  const handleRejeitarConteudo = (id: string) => {
    // Em uma implementação real, isso faria uma chamada para a API
    console.log('Rejeitar conteúdo:', id);
  };

  const handleRemoverConteudo = (id: string) => {
    // Em uma implementação real, isso faria uma chamada para a API
    console.log('Remover conteúdo:', id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Painel Administrativo
              </h1>
              <p className="text-gray-600">
                Gerencie usuários, conteúdos e monitore a plataforma
              </p>
            </div>
          </div>
        </div>

        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-bold text-gray-900">{totalUsuarios.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Conteúdos</p>
                <p className="text-2xl font-bold text-gray-900">{totalConteudos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <Eye className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Visualizações</p>
                <p className="text-2xl font-bold text-gray-900">{totalVisualizacoes.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taxa de Aprovação</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((conteudosPublicos / totalConteudos) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Moderação de Conteúdos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Moderação de Conteúdos
              </h2>
              
              {/* Filtros */}
              <div className="flex space-x-2">
                {[
                  { key: 'todos', label: 'Todos', count: totalConteudos },
                  { key: 'pendentes', label: 'Pendentes', count: totalConteudos - conteudosPublicos },
                  { key: 'aprovados', label: 'Aprovados', count: conteudosPublicos },
                  { key: 'rejeitados', label: 'Rejeitados', count: 0 }
                ].map((filtro) => (
                  <button
                    key={filtro.key}
                    onClick={() => setFiltroConteudo(filtro.key as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      filtroConteudo === filtro.key
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {filtro.label} ({filtro.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6">
            {conteudosFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum conteúdo encontrado
                </h3>
                <p className="text-gray-600">
                  Não há conteúdos para moderar no momento
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {conteudosFiltrados.map((conteudo) => (
                  <div key={conteudo.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {conteudo.titulo}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            conteudo.publico 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {conteudo.publico ? 'Aprovado' : 'Pendente'}
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
                          <span>Criador: {conteudo.criadorNome}</span>
                          <span>Categoria: {conteudo.categoria}</span>
                          <span>Visualizações: {conteudo.visualizacoes}</span>
                          <span>Curtidas: {conteudo.likes}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => window.open(`/conteudo/${conteudo.id}`, '_blank')}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Visualizar"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {!conteudo.publico && (
                          <button
                            onClick={() => handleAprovarConteudo(conteudo.id)}
                            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                            title="Aprovar"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => handleRejeitarConteudo(conteudo.id)}
                          className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Rejeitar"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleRemoverConteudo(conteudo.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remover"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Relatórios Rápidos */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Atividade Recente */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Atividade Recente
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Novo usuário registrado: Maria Silva</span>
                <span className="text-gray-400">há 2 min</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Conteúdo publicado: "Introdução ao JavaScript"</span>
                <span className="text-gray-400">há 15 min</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Quiz completado por João Santos</span>
                <span className="text-gray-400">há 1 hora</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">Novo conteúdo aguardando aprovação</span>
                <span className="text-gray-400">há 2 horas</span>
              </div>
            </div>
          </div>

          {/* Métricas de Engajamento */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Métricas de Engajamento
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Taxa de Conclusão de Quizzes</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Tempo Médio por Conteúdo</span>
                  <span className="font-medium">12 min</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Retenção de Usuários (7 dias)</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}