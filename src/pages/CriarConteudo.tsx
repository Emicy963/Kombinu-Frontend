import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { useAuth } from '../contexts/AuthContext';
import { contentService } from '../services/contentService';
import { Save, Plus, Trash2, BookOpen, Video, FileText, Clock, Target, Tag } from 'lucide-react';

export default function CriarConteudo() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState<'text' | 'video' | 'quiz'>('text');
  const [conteudo, setConteudo] = useState('');
  const [tempoEstimado, setTempoEstimado] = useState(15);
  const [dificuldade, setDificuldade] = useState<'Iniciante' | 'Intermediário' | 'Avançado'>('Iniciante');
  const [tags, setTags] = useState<string[]>([]);
  const [novaTag, setNovaTag] = useState('');
  const [publico, setPublico] = useState(false);
  const [quiz, setQuiz] = useState([
    {
      id: '1',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      points: 10,
    }
  ]);

  const adicionarPergunta = () => {
    setQuiz([
      ...quiz,
      {
        id: Date.now().toString(),
        question: '',
        options: ['', '', '', ''],
        correctAnswer: 0,
        points: 10,
      }
    ]);
  };

  const removerPergunta = (id: string) => {
    setQuiz(quiz.filter(p => p.id !== id));
  };

  const atualizarPergunta = (id: string, campo: string, valor: any) => {
    setQuiz(quiz.map(p => 
      p.id === id ? { ...p, [campo]: valor } : p
    ));
  };

  const atualizarOpcao = (perguntaId: string, opcaoIndex: number, valor: string) => {
    setQuiz(quiz.map(p => 
      p.id === perguntaId 
        ? { ...p, options: p.options.map((opcao, index) => index === opcaoIndex ? valor : opcao) }
        : p
    ));
  };

  const adicionarTag = () => {
    if (novaTag.trim() && !tags.includes(novaTag.trim())) {
      setTags([...tags, novaTag.trim()]);
      setNovaTag('');
    }
  };

  const removerTag = (tagParaRemover: string) => {
    setTags(tags.filter(tag => tag !== tagParaRemover));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (tipo === 'quiz' && quiz.some(q => !q.question.trim())) {
        alert('Por favor, preencha todas as perguntas do quiz.');
        return;
    }

    try {
        await contentService.create({
            title: titulo,
            description: descricao,
            category: categoria || 'Geral',
            thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500', // Mock thumbnail
            level: dificuldade,
            duration: `${tempoEstimado}h`, // Simplified for now
            rating: 0,
            students: 0,
            price: 0, // Free for now
            type: tipo,
            textContent: tipo === 'text' ? conteudo : undefined,
            videoUrl: tipo === 'video' ? conteudo : undefined,
            quiz: tipo === 'quiz' ? quiz : undefined,
            tags,
            creatorName: usuario?.nome || 'Anônimo'
        });
        navigate('/dashboard/creator');
    } catch (error) {
        console.error("Failed to create content", error);
        alert("Erro ao criar conteúdo. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Criar Novo Conteúdo
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Crie conteúdos incríveis e gamificados para engajar sua audiência
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título do Conteúdo
                </label>
                <input
                  type="text"
                  required
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Digite um título atrativo para seu conteúdo"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  required
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Descreva o que os aprendizes vão aprender com este conteúdo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categoria
                </label>
                <input
                  type="text"
                  required
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Ex: Tecnologia, Negócios, Idiomas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Conteúdo
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setTipo('text')}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      tipo === 'text'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <FileText className={`w-6 h-6 mx-auto mb-1 ${tipo === 'text' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                    <div className={`text-sm font-medium ${tipo === 'text' ? 'text-blue-900 dark:text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>Texto</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setTipo('video')}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      tipo === 'video'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Video className={`w-6 h-6 mx-auto mb-1 ${tipo === 'video' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                    <div className={`text-sm font-medium ${tipo === 'video' ? 'text-blue-900 dark:text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>Vídeo</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setTipo('quiz')}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      tipo === 'quiz'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:border-blue-400'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <BookOpen className={`w-6 h-6 mx-auto mb-1 ${tipo === 'quiz' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'}`} />
                    <div className={`text-sm font-medium ${tipo === 'quiz' ? 'text-blue-900 dark:text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>Quiz</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Tempo Estimado (horas)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={tempoEstimado}
                  onChange={(e) => setTempoEstimado(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Target className="w-4 h-4 inline mr-1" />
                  Dificuldade
                </label>
                <select
                  value={dificuldade}
                  onChange={(e) => setDificuldade(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removerTag(tag)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={novaTag}
                  onChange={(e) => setNovaTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarTag())}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Digite uma tag e pressione Enter"
                />
                <button
                  type="button"
                  onClick={adicionarTag}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>

          {/* Conteúdo Específico */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {tipo === 'quiz' ? 'Perguntas do Quiz' : 'Conteúdo'}
            </h2>
            
            {tipo !== 'quiz' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {tipo === 'video' ? 'URL do Vídeo' : 'Conteúdo do Material'}
                </label>
                <textarea
                  required
                  value={conteudo}
                  onChange={(e) => setConteudo(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={
                    tipo === 'video' 
                      ? 'Cole aqui o link do YouTube, Vimeo ou outro serviço de vídeo'
                      : 'Escreva aqui o conteúdo educacional que será apresentado aos aprendizes'
                  }
                />
              </div>
            ) : (
              <div className="space-y-6">
                {quiz.map((pergunta, perguntaIndex) => (
                  <div key={pergunta.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Pergunta {perguntaIndex + 1}
                      </h3>
                      {quiz.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removerPergunta(pergunta.id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Pergunta
                        </label>
                        <input
                          type="text"
                          value={pergunta.question}
                          onChange={(e) => atualizarPergunta(pergunta.id, 'question', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          placeholder="Digite a pergunta"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Opções de Resposta
                        </label>
                        <div className="space-y-2">
                          {pergunta.options.map((opcao, opcaoIndex) => (
                            <div key={opcaoIndex} className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name={`resposta-${pergunta.id}`}
                                checked={pergunta.correctAnswer === opcaoIndex}
                                onChange={() => atualizarPergunta(pergunta.id, 'correctAnswer', opcaoIndex)}
                                className="text-blue-600"
                              />
                              <input
                                type="text"
                                value={opcao}
                                onChange={(e) => atualizarOpcao(pergunta.id, opcaoIndex, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                placeholder={`Opção ${opcaoIndex + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          Selecione a opção correta marcando o círculo correspondente
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Pontos
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={pergunta.points}
                            onChange={(e) => atualizarPergunta(pergunta.id, 'points', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={adicionarPergunta}
                  className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:border-blue-400 dark:hover:text-blue-400 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Adicionar Nova Pergunta</span>
                </button>
              </div>
            )}
          </div>

          {/* Configurações de Publicação */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Configurações de Publicação</h2>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="publico"
                checked={publico}
                onChange={(e) => setPublico(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
              <label htmlFor="publico" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Publicar no marketplace (visível para todos os usuários)
              </label>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Se não marcado, o conteúdo ficará como rascunho e só você poderá vê-lo
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/creator')}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all transform hover:scale-105 flex items-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{publico ? 'Publicar Conteúdo' : 'Salvar Rascunho'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}