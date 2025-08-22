import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Clock, CheckCircle, XCircle, ArrowLeft, Trophy, Star } from 'lucide-react';

export default function Quiz() {
  const { id } = useParams<{ id: string }>();
  const { usuario, atualizarPontos } = useAuth();
  const { obterConteudo, salvarProgresso, obterProgresso, atualizarRankingAposQuiz } = useData();
  const navigate = useNavigate();
  
  const [conteudo, setConteudo] = useState(obterConteudo(id || ''));
  const [perguntaAtual, setPerguntaAtual] = useState(0);
  const [respostas, setRespostas] = useState<number[]>([]);
  const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [quizConcluido, setQuizConcluido] = useState(false);
  const [pontuacao, setPontuacao] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(30);
  const [inicioTempo] = useState(Date.now());

  useEffect(() => {
    if (!conteudo || conteudo.tipo !== 'quiz' || !conteudo.quiz) {
      navigate('/marketplace');
      return;
    }

    // Timer para cada pergunta
    const timer = setInterval(() => {
      setTempoRestante(prev => {
        if (prev <= 1) {
          // Tempo esgotado, avançar para próxima pergunta
          handleProximaPergunta();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [perguntaAtual, conteudo]);

  const handleSelecionarResposta = (opcaoIndex: number) => {
    setRespostaSelecionada(opcaoIndex);
  };

  const handleProximaPergunta = () => {
    if (!conteudo?.quiz) return;

    const novasRespostas = [...respostas];
    novasRespostas[perguntaAtual] = respostaSelecionada ?? -1;
    setRespostas(novasRespostas);

    if (perguntaAtual < conteudo.quiz.length - 1) {
      setPerguntaAtual(perguntaAtual + 1);
      setRespostaSelecionada(null);
      setTempoRestante(30);
    } else {
      // Quiz concluído
      finalizarQuiz(novasRespostas);
    }
  };

  const finalizarQuiz = (respostasFinais: number[]) => {
    if (!conteudo?.quiz || !usuario) return;

    // Calcular tempo gasto primeiro
    const tempoGasto = Math.floor((Date.now() - inicioTempo) / 1000);

    let pontos = 0;
    let acertos = 0;

    respostasFinais.forEach((resposta, index) => {
      if (resposta === conteudo.quiz![index].respostaCerta) {
        pontos += conteudo.quiz![index].pontos;
        acertos++;
      }
    });

    setPontuacao(pontos);
    setQuizConcluido(true);

    // Atualizar pontos do usuário
    atualizarPontos(pontos);

    // Integração com sistema de rankings dinâmicos
    if (usuario && conteudo) {
      atualizarRankingAposQuiz(
        usuario.id,
        conteudo.id,
        conteudo.categoria,
        pontos,
        acertos,
        conteudo.quiz!.length,
        tempoGasto
      );
      
      console.log('Ranking atualizado após conclusão do quiz', {
        usuarioId: usuario.id, 
        quizId: conteudo.id, 
        pontosGanhos: pontos, 
        acertos
      });
    }

    // Salvar progresso
    const progresso = {
      usuarioId: usuario.id,
      conteudoId: conteudo.id,
      progresso: 100,
      concluido: true,
      pontos,
      tempoGasto,
      dataInicio: new Date(inicioTempo),
      dataConclusao: new Date()
    };

    salvarProgresso(progresso);
  };

  const handleVoltarConteudo = () => {
    navigate(`/conteudo/${id}`);
  };

  if (!conteudo || conteudo.tipo !== 'quiz' || !conteudo.quiz) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Quiz não encontrado</h1>
            <button
              onClick={() => navigate('/marketplace')}
              className="text-blue-600 hover:text-blue-800"
            >
              Voltar ao Marketplace
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizConcluido) {
    const acertos = respostas.filter((resposta, index) => 
      resposta === conteudo.quiz![index].respostaCerta
    ).length;
    const percentualAcerto = Math.round((acertos / conteudo.quiz.length) * 100);

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Quiz Concluído! 🎉
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{acertos}</div>
                <div className="text-gray-600">Acertos</div>
              </div>
              
              <div className="bg-yellow-50 rounded-xl p-6">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{pontuacao}</div>
                <div className="text-gray-600">Pontos Ganhos</div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">{percentualAcerto}%</div>
                <div className="text-gray-600">Aproveitamento</div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-1 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-8 h-8 ${
                    percentualAcerto >= star * 20
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            <div className="space-y-4">
              <button
                onClick={handleVoltarConteudo}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-800 transition-all transform hover:scale-105"
              >
                Voltar ao Conteúdo
              </button>
              
              <button
                onClick={() => navigate('/marketplace')}
                className="w-full border-2 border-blue-500 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all"
              >
                Explorar Mais Conteúdos
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pergunta = conteudo.quiz[perguntaAtual];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cabeçalho do Quiz */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          
          <div className="text-white text-center">
            <h1 className="text-2xl font-bold">{conteudo.titulo}</h1>
            <p className="text-blue-100">Quiz Interativo</p>
          </div>
          
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-4 py-2">
            <Clock className="w-5 h-5 text-white" />
            <span className="text-white font-bold text-lg">
              {String(Math.floor(tempoRestante / 60)).padStart(2, '0')}:
              {String(tempoRestante % 60).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Card do Quiz */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Barra de Progresso */}
          <div className="bg-gray-200 h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-yellow-500 h-2 transition-all duration-300"
              style={{ width: `${((perguntaAtual + 1) / conteudo.quiz.length) * 100}%` }}
            ></div>
          </div>

          <div className="p-8">
            {/* Cabeçalho da Pergunta */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Pergunta {perguntaAtual + 1} de {conteudo.quiz.length}
              </h2>
              <div className="text-sm text-gray-500">
                {pergunta.pontos} pontos
              </div>
            </div>

            {/* Pergunta */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                {pergunta.pergunta}
              </h3>

              {/* Opções */}
              <div className="space-y-4">
                {pergunta.opcoes.map((opcao, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelecionarResposta(index)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                      respostaSelecionada === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        respostaSelecionada === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      }`}>
                        {respostaSelecionada === index && (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-gray-800 font-medium">{opcao}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Botão de Próxima */}
            <div className="flex justify-end">
              <button
                onClick={handleProximaPergunta}
                disabled={respostaSelecionada === null}
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-800 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {perguntaAtual < conteudo.quiz.length - 1 ? 'Próxima Pergunta' : 'Finalizar Quiz'}
              </button>
            </div>
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-6 text-center text-white text-sm opacity-80">
          <p>Responda todas as perguntas para ganhar pontos e subir no ranking!</p>
        </div>
      </div>
    </div>
  );
}