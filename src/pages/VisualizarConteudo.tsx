import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { BookOpen, Clock, User, Eye, Heart, Star, Play, ArrowLeft, Trophy } from 'lucide-react';

export default function VisualizarConteudo() {
  const { id } = useParams<{ id: string }>();
  const { usuario } = useAuth();
  const { obterConteudo, incrementarVisualizacao, toggleLike, salvarProgresso, obterProgresso } = useData();
  const navigate = useNavigate();
  
  const [conteudo, setConteudo] = useState(obterConteudo(id || ''));
  const [curtido, setCurtido] = useState(false);
  const [progresso, setProgresso] = useState(obterProgresso(usuario?.id || '', id || ''));

  useEffect(() => {
    if (!conteudo) {
      navigate('/marketplace');
      return;
    }

    // Incrementar visualização apenas uma vez
    incrementarVisualizacao(conteudo.id);
    
    // Iniciar progresso se não existir
    if (!progresso && usuario) {
      const novoProgresso = {
        usuarioId: usuario.id,
        conteudoId: conteudo.id,
        progresso: 0,
        concluido: false,
        pontos: 0,
        tempoGasto: 0,
        dataInicio: new Date()
      };
      salvarProgresso(novoProgresso);
      setProgresso(novoProgresso);
    }
  }, [conteudo, progresso, usuario]);

  const handleCurtir = () => {
    if (conteudo) {
      toggleLike(conteudo.id);
      setCurtido(!curtido);
      setConteudo({ ...conteudo, likes: conteudo.likes + (curtido ? -1 : 1) });
    }
  };

  const handleIniciarQuiz = () => {
    if (conteudo && conteudo.tipo === 'quiz') {
      navigate(`/quiz/${conteudo.id}`);
    }
  };

  const marcarComoConcluido = () => {
    if (usuario && conteudo && progresso) {
      const progressoAtualizado = {
        ...progresso,
        progresso: 100,
        concluido: true,
        pontos: progresso.pontos + 50, // Pontos por conclusão
        dataConclusao: new Date()
      };
      salvarProgresso(progressoAtualizado);
      setProgresso(progressoAtualizado);
    }
  };

  if (!conteudo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Conteúdo não encontrado</h1>
            <Link to="/marketplace" className="text-blue-600 hover:text-blue-800">
              Voltar ao Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navegação */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
        </div>

        {/* Cabeçalho do Conteúdo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {conteudo.titulo}
              </h1>
              
              <p className="text-gray-600 text-lg mb-6">
                {conteudo.descricao}
              </p>

              {/* Tags e Metadados */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className={`px-3 py-1 text-sm rounded-full ${
                  conteudo.tipo === 'quiz' ? 'bg-blue-100 text-blue-800' : 
                  conteudo.tipo === 'video' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {conteudo.tipo === 'quiz' ? 'Quiz Interativo' : 
                   conteudo.tipo === 'video' ? 'Vídeo' : 'Conteúdo Textual'}
                </span>
                
                <span className={`px-3 py-1 text-sm rounded-full ${getDificuldadeColor(conteudo.dificuldade)}`}>
                  {getDificuldadeText(conteudo.dificuldade)}
                </span>
                
                <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                  {conteudo.categoria}
                </span>
              </div>

              {/* Tags personalizadas */}
              {conteudo.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {conteudo.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Estatísticas */}
              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{conteudo.criadorNome}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{conteudo.tempoEstimado} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{conteudo.visualizacoes} visualizações</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{conteudo.likes} curtidas</span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col space-y-3 lg:ml-8">
              <button
                onClick={handleCurtir}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  curtido 
                    ? 'bg-red-50 border-red-200 text-red-700' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${curtido ? 'fill-current' : ''}`} />
                <span>{curtido ? 'Curtido' : 'Curtir'}</span>
              </button>

              {progresso && !progresso.concluido && (
                <button
                  onClick={marcarComoConcluido}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Trophy className="w-5 h-5" />
                  <span>Marcar como Concluído</span>
                </button>
              )}
            </div>
          </div>

          {/* Barra de Progresso */}
          {progresso && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Seu Progresso</span>
                <span className="text-sm text-gray-500">{progresso.progresso}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-700 h-3 rounded-full transition-all duration-300" 
                  style={{ width: `${progresso.progresso}%` }}
                ></div>
              </div>
              {progresso.concluido && (
                <div className="flex items-center space-x-2 mt-2 text-green-600">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-medium">Conteúdo concluído! +{progresso.pontos} pontos</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Conteúdo Principal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          {conteudo.tipo === 'quiz' ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Quiz Interativo Disponível
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Este conteúdo inclui um quiz interativo com {conteudo.quiz?.length || 0} perguntas. 
                Teste seus conhecimentos e ganhe pontos!
              </p>
              <button
                onClick={handleIniciarQuiz}
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-800 transition-all transform hover:scale-105 flex items-center space-x-3 mx-auto"
              >
                <Play className="w-6 h-6" />
                <span>Iniciar Quiz</span>
              </button>
            </div>
          ) : conteudo.tipo === 'video' ? (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Conteúdo em Vídeo</h2>
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Link do vídeo:</p>
                <a 
                  href={conteudo.conteudo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline break-all"
                >
                  {conteudo.conteudo}
                </a>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Conteúdo</h2>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {conteudo.conteudo}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Informações do Criador */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sobre o Criador</h3>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-yellow-400 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{conteudo.criadorNome}</p>
              <p className="text-sm text-gray-500">Criador de Conteúdo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}