/**
 * Página de Rankings Dinâmicos
 * Exibe rankings atualizados em tempo real baseados nos resultados dos quizzes
 */

import React from 'react';
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Users, Calendar, Globe } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useRanking, useRankingStats } from '../hooks/useRanking';
import { logger } from '../utils/logger';

type PeriodoRanking = 'global' | 'semanal' | 'mensal';

/**
 * Componente principal da página de Rankings
 */
export default function Ranking() {
  // Hooks para dados dinâmicos de ranking
  const { 
    rankingAtual,
    filtroAtivo,
    alterarFiltro,
    carregando, 
    obterTendencia 
  } = useRanking();
  
  const { 
    totalUsuarios, 
    usuariosAtivosUltimaSemana, 
    usuariosAtivosUltimoMes 
  } = useRankingStats();

  // Log da renderização da página
  React.useEffect(() => {
    logger.info(
      `Página de Rankings renderizada - Período: ${filtroAtivo}`,
      'Ranking',
      { 
        totalUsuarios: rankingAtual.length,
        periodo: filtroAtivo,
        carregando 
      }
    );
  }, [filtroAtivo, rankingAtual.length, carregando]);

  /**
   * Renderiza o ícone de tendência baseado na posição anterior
   */
  const renderizarTendencia = (usuarioId: string) => {
    const tendencia = obterTendencia(usuarioId);
    
    if (tendencia === 'subiu') {
      return <TrendingUp className="w-4 h-4 text-green-500" />;
    } else if (tendencia === 'desceu') {
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  /**
   * Renderiza o ícone da medalha baseado na posição
   */
  const renderizarMedalha = (posicao: number) => {
    if (posicao === 1) {
      return <Trophy className="w-6 h-6 text-yellow-500" />;
    } else if (posicao === 2) {
      return <Medal className="w-6 h-6 text-gray-400" />;
    } else if (posicao === 3) {
      return <Award className="w-6 h-6 text-amber-600" />;
    }
    return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-500">#{posicao}</span>;
  };

  /**
   * Renderiza as estatísticas gerais
   */
  const renderizarEstatisticas = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-blue-500" />
          <div>
            <p className="text-sm text-gray-600">Total de Usuários</p>
            <p className="text-2xl font-bold text-gray-900">{totalUsuarios}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <Calendar className="w-8 h-8 text-green-500" />
          <div>
            <p className="text-sm text-gray-600">Ativos (Semana)</p>
            <p className="text-2xl font-bold text-gray-900">{usuariosAtivosUltimaSemana}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <div className="flex items-center space-x-3">
          <Globe className="w-8 h-8 text-purple-500" />
          <div>
            <p className="text-sm text-gray-600">Ativos (Mês)</p>
            <p className="text-2xl font-bold text-gray-900">{usuariosAtivosUltimoMes}</p>
          </div>
        </div>
      </Card>
    </div>
  );

  /**
   * Renderiza os filtros de período
   */
  const renderizarFiltros = () => (
    <div className="flex space-x-2 mb-6">
      {[
        { key: 'global' as PeriodoRanking, label: 'Global', icon: Globe },
        { key: 'semanal' as PeriodoRanking, label: 'Semanal', icon: Calendar },
        { key: 'mensal' as PeriodoRanking, label: 'Mensal', icon: Calendar }
      ].map(({ key, label, icon: Icon }) => (
        <Button
          key={key}
          variant={filtroAtivo === key ? 'primary' : 'secondary'}
          onClick={() => alterarFiltro(key)}
          className="flex items-center space-x-2"
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </Button>
      ))}
    </div>
  );

  /**
   * Renderiza a lista de rankings
   */
  const renderizarListaRankings = () => {
    if (carregando) {
      return (
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando rankings...</p>
        </Card>
      );
    }

    if (rankingAtual.length === 0) {
      return (
        <Card className="p-8 text-center">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Nenhum ranking disponível
          </h3>
          <p className="text-gray-600">
            Complete alguns quizzes para aparecer no ranking!
          </p>
        </Card>
      );
    }

    return (
      <Card className="overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Ranking {filtroAtivo.charAt(0).toUpperCase() + filtroAtivo.slice(1)}
          </h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {rankingAtual.map((usuario, index) => (
            <div
              key={usuario.usuarioId}
              className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                index < 3 ? 'bg-gradient-to-r from-yellow-50 to-transparent' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                {/* Posição e medalha */}
                <div className="flex items-center space-x-2">
                  {renderizarMedalha(usuario.posicao)}
                  {renderizarTendencia(usuario.usuarioId)}
                </div>
                
                {/* Avatar e informações do usuário */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {usuario.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{usuario.nome}</p>
                    <p className="text-sm text-gray-600">
                      {usuario.quizzesCompletados} quizzes • {usuario.mediaAcertos.toFixed(1)}% acertos
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Pontuação */}
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{usuario.pontos}</p>
                <p className="text-sm text-gray-600">pontos</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏆 Rankings
          </h1>
          <p className="text-gray-600">
            Veja como você se compara com outros usuários
          </p>
        </div>

        {/* Estatísticas gerais */}
        {renderizarEstatisticas()}

        {/* Filtros de período */}
        {renderizarFiltros()}

        {/* Lista de rankings */}
        {renderizarListaRankings()}
      </div>
    </div>
  );
}