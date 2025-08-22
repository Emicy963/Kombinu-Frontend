import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Save, Plus, Trash2, BookOpen, Video, FileText, Clock, Target, Tag } from 'lucide-react';

export default function CriarConteudo() {
  const { usuario } = useAuth();
  const { criarConteudo } = useData();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [categoria, setCategoria] = useState('');
  const [tipo, setTipo] = useState<'texto' | 'video' | 'quiz'>('texto');
  const [conteudo, setConteudo] = useState('');
  const [tempoEstimado, setTempoEstimado] = useState(15);
  const [dificuldade, setDificuldade] = useState<'facil' | 'medio' | 'dificil'>('facil');
  const [tags, setTags] = useState<string[]>([]);
  const [novaTag, setNovaTag] = useState('');
  const [publico, setPublico] = useState(false);
  const [quiz, setQuiz] = useState([
    {
      id: '1',
      pergunta: '',
      opcoes: ['', '', '', ''],
      respostaCerta: 0,
      pontos: 10,
      explicacao: ''
    }
  ]);

  const adicionarPergunta = () => {
    const novaPergunta = {
      id: Date.now().toString(),
      pergunta: '',
      opcoes: ['', '', '', ''],
      respostaCerta: 0,
      pontos: 10,
      explicacao: ''
    };
    setQuiz([...quiz, novaPergunta]);
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
        ? { ...p, opcoes: p.opcoes.map((opcao, index) => index === opcaoIndex ? valor : opcao) }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuario) return;

    const novoConteudo = {
      titulo,
      descricao,
      categoria,
      criadorId: usuario.id,
      criadorNome: usuario.nome,
      tipo,
      conteudo,
      quiz: tipo === 'quiz' ? quiz.filter(p => p.pergunta.trim()) : undefined,
      tempoEstimado,
      dificuldade,
      tags,
      publico
    };

    criarConteudo(novoConteudo);
    navigate('/dashboard-criador');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Criar Novo Conteúdo
          </h1>
          <p className="text-gray-600">
            Crie conteúdos incríveis e gamificados para engajar sua audiência
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título do Conteúdo
                </label>
                <input
                  type="text"
                  required
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Digite um título atrativo para seu conteúdo"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  required
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descreva o que os aprendizes vão aprender com este conteúdo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <input
                  type="text"
                  required
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Tecnologia, Negócios, Idiomas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Conteúdo
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setTipo('texto')}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      tipo === 'texto'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <FileText className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                    <div className="text-sm font-medium">Texto</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setTipo('video')}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      tipo === 'video'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <Video className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                    <div className="text-sm font-medium">Vídeo</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setTipo('quiz')}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      tipo === 'quiz'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <BookOpen className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                    <div className="text-sm font-medium">Quiz</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Tempo Estimado (minutos)
                </label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={tempoEstimado}
                  onChange={(e) => setTempoEstimado(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Target className="w-4 h-4 inline mr-1" />
                  Dificuldade
                </label>
                <select
                  value={dificuldade}
                  onChange={(e) => setDificuldade(e.target.value as 'facil' | 'medio' | 'dificil')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="facil">Fácil</option>
                  <option value="medio">Médio</option>
                  <option value="dificil">Difícil</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="w-4 h-4 inline mr-1" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removerTag(tag)}
                      className="text-blue-600 hover:text-blue-800"
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
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          {/* Conteúdo */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {tipo === 'quiz' ? 'Perguntas do Quiz' : 'Conteúdo'}
            </h2>
            
            {tipo !== 'quiz' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tipo === 'video' ? 'URL do Vídeo' : 'Conteúdo do Material'}
                </label>
                <textarea
                  required
                  value={conteudo}
                  onChange={(e) => setConteudo(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  <div key={pergunta.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Pergunta {perguntaIndex + 1}
                      </h3>
                      {quiz.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removerPergunta(pergunta.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pergunta
                        </label>
                        <input
                          type="text"
                          value={pergunta.pergunta}
                          onChange={(e) => atualizarPergunta(pergunta.id, 'pergunta', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Digite a pergunta"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Opções de Resposta
                        </label>
                        <div className="space-y-2">
                          {pergunta.opcoes.map((opcao, opcaoIndex) => (
                            <div key={opcaoIndex} className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name={`resposta-${pergunta.id}`}
                                checked={pergunta.respostaCerta === opcaoIndex}
                                onChange={() => atualizarPergunta(pergunta.id, 'respostaCerta', opcaoIndex)}
                                className="text-blue-600"
                              />
                              <input
                                type="text"
                                value={opcao}
                                onChange={(e) => atualizarOpcao(pergunta.id, opcaoIndex, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={`Opção ${opcaoIndex + 1}`}
                              />
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          Selecione a opção correta marcando o círculo correspondente
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pontos
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={pergunta.pontos}
                            onChange={(e) => atualizarPergunta(pergunta.id, 'pontos', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Explicação (opcional)
                        </label>
                        <textarea
                          value={pergunta.explicacao}
                          onChange={(e) => atualizarPergunta(pergunta.id, 'explicacao', e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Explique por que esta é a resposta correta"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={adicionarPergunta}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Adicionar Nova Pergunta</span>
                </button>
              </div>
            )}
          </div>

          {/* Configurações de Publicação */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Configurações de Publicação</h2>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="publico"
                checked={publico}
                onChange={(e) => setPublico(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="publico" className="text-sm font-medium text-gray-700">
                Publicar no marketplace (visível para todos os usuários)
              </label>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Se não marcado, o conteúdo ficará como rascunho e só você poderá vê-lo
            </p>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard-criador')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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