/**
 * Página de Rankings Dinâmicos
 * Exibe rankings atualizados em tempo real baseados nos resultados dos quizzes
 */

import React from 'react';
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  Globe, 
  Crown, 
  ArrowUp, 
  ArrowDown, 
  Minus 
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useRanking, useRankingStats } from '../hooks/useRanking';
import { logger } from '../utils/logger';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
type PeriodoRanking = 'global' | 'semanal' | 'mensal';

interface RankingUser {
  id: string;
  name: string;
  points: number;
  trend: 'up' | 'down' | 'same';
  avatar?: string;
}

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
  const { usuario } = useAuth();
  // const { obterRanking } = useData();
  const [rankingData, setRankingData] = useState<RankingUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
        setLoading(true);
        try {
          const { api } = await import('../services/api');
          const response = await api.get('/rankings/global/');
          // response.data shape is { top_users: [...], user_position: {...} }
          
          if (response.data && Array.isArray(response.data.top_users)) {
             const realData: RankingUser[] = response.data.top_users.map((u: any, i: number) => ({
                 id: String(u.user_id),
                 name: u.email.split('@')[0], // Fallback se não vier o nome
                 points: u.total_score,
                 trend: 'same', // Simplificação para esta versão
                 avatar: undefined
             }));
             
             // Se o user estiver logado e tiver user_position, mas NÃO estiver nos top users mostrados, adicionamos no final manual
             if (usuario && response.data.user_position && !realData.find(x => x.id === usuario.id)) {
                 realData.push({
                     id: usuario.id,
                     name: usuario.nome,
                     points: response.data.user_position.total_score,
                     trend: 'same'
                 });
             }
             
             setRankingData(realData);
          } else {
             // Fallback local state se der erro de contrato
             setRankingData([]);
          }
        } catch (error) {
           console.error("Erro ao buscar ranking global", error);
           setRankingData([]);
        } finally {
            setLoading(false);
        }
    };

    fetchRanking();
  }, [usuario]);


  const getPositionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-8 h-8 text-yellow-500" />;
      case 1:
        return <Medal className="w-8 h-8 text-gray-400" />;
      case 2:
        return <Medal className="w-8 h-8 text-orange-400" />;
      default:
        return <span className="text-xl font-bold text-gray-500 w-8 text-center">{index + 1}</span>;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'same') => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  if (loading) {
     return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ranking Global 🏆
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Veja quem são os maiores aprendizes da comunidade KOMBINU
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Cabeçalho da Tabela */}
          <div className="grid grid-cols-12 gap-4 p-6 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            <div className="col-span-2 text-center">Posição</div>
            <div className="col-span-6">Usuário</div>
            <div className="col-span-2 text-center">Pontos</div>
            <div className="col-span-2 text-center">Tendência</div>
          </div>

          {/* Lista de Ranking */}
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {rankingData.map((user, index) => (
              <div 
                key={user.id}
                className={`grid grid-cols-12 gap-4 p-6 items-center transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
                  usuario?.id === user.id ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="col-span-2 flex justify-center items-center">
                  {getPositionIcon(index)}
                </div>
                
                <div className="col-span-6 flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-lg">{user.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className={`font-bold ${
                      usuario?.id === user.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'
                    }`}>
                      {user.name} {usuario?.id === user.id && '(Você)'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Nível {Math.floor(user.points / 1000) + 1}</p>
                  </div>
                </div>
                
                <div className="col-span-2 text-center font-bold text-gray-900 dark:text-white">
                  {user.points.toLocaleString()}
                </div>
                
                <div className="col-span-2 flex justify-center items-center">
                  {getTrendIcon(user.trend)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card do Usuário (se não estiver no top 10) */}
        {usuario && !rankingData.find(u => u.id === usuario.id) && (
           <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-blue-100 dark:border-blue-900/30 p-6">
             <div className="flex items-center justify-between">
               <div className="flex items-center space-x-4">
                 <div className="text-xl font-bold text-gray-500 dark:text-gray-400 w-8 text-center">42</div>
                 <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                   {usuario.nome.charAt(0)}
                 </div>
                 <div>
                   <p className="font-bold text-gray-900 dark:text-white">{usuario.nome} (Você)</p>
                   <p className="text-sm text-gray-500 dark:text-gray-400">Continue aprendendo para subir no ranking!</p>
                 </div>
               </div>
               <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                 {usuario.pontos} pts
               </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}