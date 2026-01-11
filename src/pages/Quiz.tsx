import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Clock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function Quiz() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    // Mock fetching quiz data
    const fetchQuiz = async () => {
        setLoading(true);
        // Simulate API call delay
        setTimeout(() => {
             setQuestions([
                {
                    id: '1',
                    question: "Qual é a principal função do React?",
                    options: [
                        "Gerenciar bancos de dados",
                        "Construir interfaces de usuário",
                        "Criar APIs",
                        "Gerenciar servidores"
                    ],
                    correctAnswer: 1
                },
                {
                    id: '2',
                    question: "O que é JSX?",
                    options: [
                        "Uma linguagem de banco de dados",
                        "Uma extensão de sintaxe para JavaScript",
                        "Um framework CSS",
                        "Uma biblioteca de testes"
                    ],
                    correctAnswer: 1
                },
                {
                    id: '3',
                    question: "Como passamos dados para componentes filhos?",
                    options: [
                        "State",
                        "Props",
                        "Context",
                        "Hooks"
                    ],
                    correctAnswer: 1
                },
                 {
                    id: '4',
                    question: "Qual hook é usado para gerenciar estado?",
                    options: [
                        "useEffect",
                        "useContext",
                        "useState",
                        "useReducer"
                    ],
                    correctAnswer: 2
                },
            ]);
            setLoading(false);
        }, 1000);
    }
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && !showResults && !loading) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !showResults && !loading) {
      finishQuiz();
    }
  }, [timeLeft, showResults, loading]);

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  const handleNextQuestion = () => {
    if (selectedOption !== null) {
      if (selectedOption === questions[currentQuestion].correctAnswer) {
        setScore(score + 1);
      }
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
      } else {
        // We need to calculate the final score including the last question BEFORE setting showResults
        // But since state updates are async, a common pattern is to just call finishQuiz logic.
        // However, we just updated the score state potentially. 
        // Better logic: Calculate final score in a temporary variable or effect.
        // For simplicity here, we assume the score update for the last question happens. 
        // Actually, React state updates are batched. 
        // Let's pass the final result logic to finishQuiz or handle it here.
        
        // Correct approach for sync logic:
        const isCorrect = selectedOption === questions[currentQuestion].correctAnswer;
        const finalScore = score + (isCorrect ? 1 : 0);
        setScore(finalScore);
        
        finishQuiz();
      }
    }
  };

  const finishQuiz = () => {
    setShowResults(true);
    // Future: Call API to save progress
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
     return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
     );
  }

  if (showResults) {
    const percentage = (score / questions.length) * 100;
    
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-gray-100 dark:border-gray-700">
            <div className="mb-6">
              {percentage >= 70 ? (
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
              ) : (
                <AlertCircle className="w-20 h-20 text-yellow-500 mx-auto" />
              )}
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {percentage >= 70 ? 'Parabéns!' : 'Continue Tentando!'}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Você acertou <span className="font-bold text-gray-900 dark:text-white">{score}</span> de <span className="font-bold text-gray-900 dark:text-white">{questions.length}</span> questões.
            </p>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-8">
              <div 
                className={`h-4 rounded-full transition-all duration-1000 ${
                  percentage >= 70 ? 'bg-green-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/marketplace')}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Voltar para Cursos
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          
          <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 shadow-sm">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="font-bold text-lg text-gray-900 dark:text-white">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Quiz Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Progress Bar */}
          <div className="bg-gray-200 dark:bg-gray-700 h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="p-8">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl text-gray-500 dark:text-gray-400 font-medium">
                Questão {currentQuestion + 1} de {questions.length}
              </h2>
            </div>

            {/* Question Text */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 leading-relaxed">
                {questions[currentQuestion].question}
              </h3>

              {/* Options */}
              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(index)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 group ${
                      selectedOption === index
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-white dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedOption === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-400'
                      }`}>
                        {selectedOption === index && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className={`text-lg font-medium ${
                         selectedOption === index ? 'text-blue-900 dark:text-blue-100' : 'text-gray-700 dark:text-gray-300'
                      }`}>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={handleNextQuestion}
                disabled={selectedOption === null}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none shadow-lg"
              >
                {currentQuestion < questions.length - 1 ? 'Próxima Pergunta' : 'Finalizar Quiz'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}