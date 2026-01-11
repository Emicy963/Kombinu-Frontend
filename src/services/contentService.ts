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
}

export const contentService = {
  getAll: async (): Promise<Content[]> => {
    // Mock data for now
    return [
      {
        id: '1',
        title: 'Introdução à Programação Python',
        description: 'Aprenda os fundamentos da linguagem Python do zero e crie seus primeiros scripts.',
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=500&auto=format&fit=crop&q=60',
        category: 'Programação',
        level: 'Iniciante',
        duration: '12h',
        rating: 4.8,
        students: 1250,
        price: 0
      },
      {
        id: '2',
        title: 'Marketing Digital para Redes Sociais',
        description: 'Domine as estratégias de marketing para crescer sua marca no Instagram e TikTok.',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60',
        category: 'Marketing',
        level: 'Iniciante',
        duration: '8h',
        rating: 4.6,
        students: 850,
        price: 0
      },
      {
        id: '3',
        title: 'Design UI/UX com Figma',
        description: 'Crie interfaces modernas e experiências de usuário incríveis utilizando o Figma.',
        thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a5638d48?w=500&auto=format&fit=crop&q=60',
        category: 'Design',
        level: 'Intermediário',
        duration: '20h',
        rating: 4.9,
        students: 2100,
        price: 15000
      },
      {
        id: '4',
        title: 'Gestão Financeira Pessoal',
        description: 'Aprenda a controlar seus gastos, investir e alcançar a liberdade financeira.',
        thumbnail: 'https://images.unsplash.com/photo-1554224155-98406858d0cb?w=500&auto=format&fit=crop&q=60',
        category: 'Finanças',
        level: 'Iniciante',
        duration: '6h',
        rating: 4.7,
        students: 3200,
        price: 5000
      },
      {
        id: '5',
        title: 'Inglês para Negócios',
        description: 'Melhore seu vocabulário e comunicação em inglês no ambiente corporativo.',
        thumbnail: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=500&auto=format&fit=crop&q=60',
        category: 'Idiomas',
        level: 'Avançado',
        duration: '15h',
        rating: 4.5,
        students: 1800,
        price: 25000
      }
    ];
  },

  getCategories: async (): Promise<string[]> => {
    return ['Todos', 'Programação', 'Marketing', 'Design', 'Finanças', 'Idiomas', 'Ciências'];
  }
};