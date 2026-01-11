import { api } from './api';

export interface DashboardStats {
  coursesCompleted: number;
  totalPoints: number;
  currentLevel: number;
  quizzesTaken: number;
}

export interface EnrolledCourse {
  id: number;
  title: string;
  progress: number;
  lastAccessed: string;
  thumbnail: string;
}

export const dashboardService = {
  getLearnerStats: async (): Promise<DashboardStats> => {
    // TODO: Connect to real backend endpoint when available
    // const response = await api.get('/dashboard/learner/stats');
    // return response.data;
    
    // Mock data for now
    return {
      coursesCompleted: 5,
      totalPoints: 1250,
      currentLevel: 12,
      quizzesTaken: 15
    };
  },

  getEnrolledCourses: async (): Promise<EnrolledCourse[]> => {
    // TODO: Connect to real backend
    return [
      {
        id: 1,
        title: "Introdução à Programação Python",
        progress: 75,
        lastAccessed: "2024-03-10",
        thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500&auto=format&fit=crop&q=60"
      },
      {
        id: 2,
        title: "Marketing Digital para Iniciantes",
        progress: 30,
        lastAccessed: "2024-03-08",
        thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60"
      },
      {
        id: 3,
        title: "Gestão Financeira Pessoal",
        progress: 10,
        lastAccessed: "2024-03-05",
        thumbnail: "https://images.unsplash.com/photo-1554224155-98406858d0cb?w=500&auto=format&fit=crop&q=60"
      }
    ];
  },

  getCreatorStats: async () => {
    // Mock data
    return {
      totalStudents: 150,
      totalCourses: 3,
      averageRating: 4.8,
      totalRevenue: 250000 // KZ
    };
  }
};
