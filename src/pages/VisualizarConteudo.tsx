import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { useAuth } from '../contexts/AuthContext';
import { contentService, Content } from '../services/contentService';
import { BookOpen, Clock, User, Eye, Heart, Play, ArrowLeft, Trophy, CheckCircle } from 'lucide-react';

export default function VisualizarConteudo() {
  const { id } = useParams<{ id: string }>();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  
  const [conteudo, setConteudo] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [curtido, setCurtido] = useState(false);
  const [concluido, setConcluido] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;
      try {
        const data = await contentService.getById(id);
        if (data) {
           setConteudo(data);
        } else {
           // Handle not found
        }
      } catch (error) {
        console.error("Failed to fetch content", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [id]);

  const handleCurtir = () => {
    setCurtido(!curtido);
    // Mock update: call service to persist like
  };

  const handleIniciarQuiz = () => {
    navigate(`/quiz/${id}`);
  };

  const marcarComoConcluido = () => {
     setConcluido(true);
     // Mock update: call service to persist progress
  };

  const getDificuldadeColor = (dificuldade: string) => {
    switch (dificuldade) {
      case 'Iniciante': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Avançado': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (loading) {
     return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
     );
  }

  if (!conteudo) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
             <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Conteúdo não encontrado</h1>
             <Link to="/courses" className="text-blue-600 dark:text-blue-400 hover:underline">Voltar para Cursos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navegação */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
        </div>

        {/* Cabeçalho do Conteúdo */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {conteudo.title}
              </h1>
              
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 leading-relaxed">
                {conteudo.description}
              </p>

              {/* Tags e Metadados */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                  conteudo.type === 'quiz' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 
                  conteudo.type === 'video' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {conteudo.type === 'quiz' ? 'Quiz Interativo' : 
                   conteudo.type === 'video' ? 'Vídeo' : 'Conteúdo Textual'}
                </span>
                
                <span className={`px-3 py-1 text-sm rounded-full font-medium ${getDificuldadeColor(conteudo.level)}`}>
                  {conteudo.level}
                </span>
                
                <span className="px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium">
                  {conteudo.category}
                </span>
              </div>

               {/* Tags personalizadas */}
               {conteudo.tags && conteudo.tags.length > 0 && (
                 <div className="flex flex-wrap gap-2 mb-6">
                   {conteudo.tags.map((tag, index) => (
                     <span
                       key={index}
                       className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                     >
                       #{tag}
                     </span>
                   ))}
                 </div>
               )}

              {/* Estatísticas */}
              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{conteudo.creatorName || 'Kombinu'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{conteudo.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{conteudo.students} alunos</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{Math.floor(conteudo.rating * 20)} curtidas</span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col space-y-3 lg:ml-8 mt-6 lg:mt-0">
              <button
                onClick={handleCurtir}
                className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                  curtido 
                    ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-900 dark:text-red-400' 
                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <Heart className={`w-5 h-5 ${curtido ? 'fill-current' : ''}`} />
                <span>{curtido ? 'Curtido' : 'Curtir'}</span>
              </button>

              {!concluido && (
                <button
                  onClick={marcarComoConcluido}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                >
                  <Trophy className="w-5 h-5" />
                  <span>Marcar Concluído</span>
                </button>
              )}
               {concluido && (
                <div className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span>Concluído!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 min-h-[300px]">
          {conteudo.type === 'quiz' ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Quiz Interativo Disponível
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Teste seus conhecimentos sobre <strong>{conteudo.title}</strong> e ganhe pontos para subir no ranking!
              </p>
              <button
                onClick={handleIniciarQuiz}
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-blue-900 transition-all transform hover:scale-105 flex items-center space-x-3 mx-auto shadow-xl"
              >
                <Play className="w-6 h-6" />
                <span>Iniciar Quiz Agora</span>
              </button>
            </div>
          ) : conteudo.type === 'video' ? (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Vídeo Aula</h2>
              <div className="aspect-w-16 aspect-h-9 bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center relative group cursor-pointer">
                 {/* Placeholder for video player */}
                 <div className="absolute inset-0 flex items-center justify-center">
                    <Play className="w-20 h-20 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <img src={conteudo.thumbnail} alt={conteudo.title} className="w-full h-full object-cover opacity-50" />
              </div>
               <div className="mt-4 text-center">
                 <p className="text-gray-500 dark:text-gray-400 text-sm">
                    (Simulação de Vídeo Player - URL: {conteudo.videoUrl})
                 </p>
               </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Material de Leitura</h2>
              <div className="prose dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                  {conteudo.textContent || conteudo.description}
                  {/* Mock long content */}
                  <br /><br />
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}