import { api } from './api';

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  points: number;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizData {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit: number; // in minutes
}

export interface QuizResult {
  score: number;
  totalPoints: number;
  correctAnswers: number;
  totalQuestions: number;
  'xp earned': number;
}

export const quizService = {
  /**
   * Generates a new quiz for a specific content
   */
  generateQuiz: async (contentId: string): Promise<QuizData> => {
    // Note: The backend endpoint is defined as contents/<id>/generate-quiz/
    // But since our api base is /api/v1/ or /api/, and contents is likely under /api/quizzes/contents/... 
    // Wait, let's check urls.py again.
    // quizzes/urls.py has `path("contents/<uuid:content_id>/generate-quiz/")`
    // And project urls probably includes quizzes urls under `api/quizzes/`
    const response = await api.post(`/quizzes/contents/${contentId}/generate-quiz/`);
    return response.data;
  },

  /**
   * Fetches an existing quiz by ID
   */
  getQuiz: async (quizId: string): Promise<QuizData> => {
    const response = await api.get(`/quizzes/${quizId}/`);
    return response.data;
  },

  /**
   * Submits quiz answers
   */
  submitQuiz: async (quizId: string, answers: Record<string, string>): Promise<QuizResult> => {
    const response = await api.post(`/quizzes/${quizId}/submit/`, { answers });
    return response.data;
  }
};
