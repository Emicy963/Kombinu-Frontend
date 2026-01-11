import { api } from './api';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  duration: string;
  rating: number;
  students: number;
  price: number;
  // Detailed fields
  type?: 'video' | 'quiz' | 'text';
  videoUrl?: string;
  textContent?: string;
  quiz?: Question[];
  creatorName?: string;
  tags?: string[];
}

export const contentService = {
  getAll: async (): Promise<Content[]> => {
    try {
      const response = await api.get('/contents/');
      // Map backend fields to frontend interface if necessary
      // Assuming backend returns a list of contents matching the interface or close to it
      // Helper to map backend format to frontend if strictly needed:
      return response.data.map((item: any) => ({
        ...item,
        // Ensure defaults for missing fields
        level: item.level || 'Iniciante',
        rating: item.rating || 0,
        students: item.students || 0,
        thumbnail: item.thumbnail || 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500' 
      }));
    } catch (error) {
      console.error('Failed to fetch contents:', error);
      return []; 
    }
  },

  getById: async (id: string): Promise<Content | undefined> => {
     try {
       const response = await api.get(`/contents/${id}/`);
       return response.data;
     } catch (error) {
       console.error(`Failed to fetch content ${id}:`, error);
       return undefined;
     }
  },

  getCategories: async (): Promise<string[]> => {
    // This could also be an endpoint
    return ['Programação', 'Marketing', 'Design', 'Finanças', 'Idiomas', 'Ciências'];
  },

  create: async (content: Omit<Content, 'id'>): Promise<Content> => {
      const response = await api.post('/contents/', content);
      return response.data;
  }
};