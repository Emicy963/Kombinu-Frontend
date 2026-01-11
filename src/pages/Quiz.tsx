import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { quizService, QuizData, QuizQuestion, QuizResult } from '../services/quizService';

export default function Quiz() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({}); // valid questionId -> optionId
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); 

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await quizService.getQuiz(id);
        setQuiz(data);
        setTimeLeft(data.timeLimit * 60); // timeLimit is in minutes
      } catch (error) {
        console.error("Failed to load quiz", error);
        // Fallback for demo/error handling (or redirect)
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && !result && !loading) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !result && !loading && quiz) {
      handleSubmitQuiz(); // Time up!
    }
  }, [timeLeft, result, loading, quiz]);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOptionId(optionId);
  };

  const handleNextQuestion = () => {
    if (!quiz || selectedOptionId === null) return;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    
    // Save answer
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: selectedOptionId
    }));

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionId(null);
    } else {
      // It was the last question, submit
      handleSubmitQuiz({ ...answers, [currentQuestion.id]: selectedOptionId });
    }
  };

  const handleSubmitQuiz = async (finalAnswers?: Record<string, string>) => {
    if (!quiz || !id) return;
    
    const answersToSubmit = finalAnswers || answers;
    
    try {
      setSubmitting(true);
      const quizResult = await quizService.submitQuiz(id, answersToSubmit);
      setResult(quizResult);
    } catch (error) {
      console.error("Failed to submit quiz", error);
      // Handle error (maybe show toast)
    } finally {
      setSubmitting(false);
    }
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

  if (!quiz) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center flex-col">
            <h2 className="text-xl text-gray-800 dark:text-white mb-4">Quiz não encontrado.</h2>
            <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">Voltar</button>
        </div>
    );
  }

  if (result) {
    const percentage = (result.score / result.totalPoints) * 100; // Assuming totalPoints is sum of points
    // Or if backend returns percentage directly/score as count. 
    // Let's assume score is points earned and totalPoints includes max possible.
    
    // Fallback if backend returns simple count
    const displayPercentage = result.totalPoints > 0 ? (result.score / result.totalPoints) * 100 : 0;

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center border border-gray-100 dark:border-gray-700">
            <div className="mb-6">
              {displayPercentage >= 70 ? (
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
              ) : (
                <AlertCircle className="w-20 h-20 text-yellow-500 mx-auto" />
              )}
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {displayPercentage >= 70 ? 'Parabéns!' : 'Continue Tentando!'}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Você fez <span className="font-bold text-gray-900 dark:text-white">{result.score}</span> pontos.
              <br/>
              Acertou <span className="font-bold text-green-600">{result.correctAnswers}</span> questões.
               {result['xp earned'] > 0 && <span className="block mt-2 text-sm text-blue-500">+{result['xp earned']} XP ganhos!</span>}
            </p>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-8">
              <div 
                className={`h-4 rounded-full transition-all duration-1000 ${
                  displayPercentage >= 70 ? 'bg-green-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${displayPercentage}%` }}
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

  const currentQuestion = quiz.questions[currentQuestionIndex];

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
              style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="p-8">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl text-gray-500 dark:text-gray-400 font-medium">
                Questão {currentQuestionIndex + 1} de {quiz.questions.length}
              </h2>
            </div>

            {/* Question Text */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 leading-relaxed">
                {currentQuestion.text}
              </h3>

              {/* Options */}
              <div className="space-y-4">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 group ${
                      selectedOptionId === option.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-white dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedOptionId === option.id
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300 dark:border-gray-600 group-hover:border-blue-400'
                      }`}>
                        {selectedOptionId === option.id && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className={`text-lg font-medium ${
                         selectedOptionId === option.id ? 'text-blue-900 dark:text-blue-100' : 'text-gray-700 dark:text-gray-300'
                      }`}>{option.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Next Button */}
            <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
              <button
                onClick={handleNextQuestion}
                disabled={selectedOptionId === null || submitting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none shadow-lg"
              >
                {submitting ? 'Enviando...' : (currentQuestionIndex < quiz.questions.length - 1 ? 'Próxima Pergunta' : 'Finalizar Quiz')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}