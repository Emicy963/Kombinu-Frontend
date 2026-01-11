import { api } from './api';

export interface DashboardStats {
  coursesCompleted: number;
  totalPoints: number;
  currentLevel: number;
  quizzesTaken: number;
}

export interface EnrolledCourse {
  id: string | number;
  title: string;
  progress: number;
  lastAccessed: string;
  thumbnail: string;
}

export const dashboardService = {
  getLearnerStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get('/dashboard/learner/stats/');
      return response.data;
    } catch (error) {
       console.warn("Failed to fetch learner stats, using fallback", error);
       // Fallback mock data if endpoint fails (or for dev before backend is ready)
       return {
        coursesCompleted: 0,
        totalPoints: 0,
        currentLevel: 1,
        quizzesTaken: 0
      };
    }
  },

  getEnrolledCourses: async (): Promise<EnrolledCourse[]> => {
    try {
        const response = await api.get('/dashboard/learner/courses/');
        return response.data;
    } catch (error) {
        console.warn("Failed to fetch courses, using fallback", error);
        return [];
    }
  },

  getCreatorStats: async () => {
    try {
        const response = await api.get('/dashboard/creator/stats/');
        return response.data;
    } catch (error) {
         console.warn("Failed to fetch creator stats, using fallback", error);
         return {
            totalStudents: 0,
            totalCourses: 0,
            averageRating: 0,
            totalRevenue: 0
        };
    }
  }
};
