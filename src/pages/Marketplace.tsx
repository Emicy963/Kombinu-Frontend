import React, { useState, useEffect } from 'react';
import { Search, Star, Clock, Users } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { contentService, Content } from '../services/contentService';
import { Link } from 'react-router-dom';

/**
 * Página principal de funcionalidades (antigo Marketplace)
 * Lista todos os cursos/conteúdos disponíveis
 */
export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [contents, setContents] = useState<Content[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await contentService.getAll();
        setContents(data);
        const cats = await contentService.getCategories();
        setCategories(['Todos', ...cats]); // Add 'Todos' option
      } catch (error) {
        console.error("Failed to fetch content", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          content.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || content.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
     return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold font-montserrat mb-6">
              Explore Conhecimento Sem Limites
            </h1>
            <p className="text-xl text-blue-100 font-lato mb-8">
              Encontre os melhores cursos e quizzes gamificados para impulsionar sua carreira
            </p>
            
            {/* Barra de Pesquisa */}
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="O que você quer aprender hoje?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-lg pl-12 dark:bg-gray-800 dark:text-white border-0"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categorias */}
        <div className="flex overflow-x-auto pb-4 mb-8 space-x-2 scrollbar-hide">
          {categories.map((categoria) => (
            <button
              key={categoria}
              onClick={() => setSelectedCategory(categoria)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium ${
                selectedCategory === categoria
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {categoria}
            </button>
          ))}
        </div>

        {/* Grid de Conteúdos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredContents.map((conteudo) => (
            <div key={conteudo.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group flex flex-col h-full">
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={conteudo.thumbnail} 
                  alt={conteudo.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-semibold text-gray-900 dark:text-white flex items-center shadow-lg">
                  <Star className="w-3 h-3 text-yellow-500 mr-1" />
                  {conteudo.rating}
                </div>
                <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white shadow-lg">
                  {conteudo.category}
                </div>
              </div>

              {/* Informações */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="font-montserrat font-bold text-xl text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {conteudo.title}
                  </h3>
                  <p className="font-lato text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                    {conteudo.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {conteudo.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {conteudo.students} alunos
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between">
                  <span className="font-montserrat font-bold text-lg text-green-600 dark:text-green-400">
                    {conteudo.price === 0 ? 'Gratuito' : `Kz ${conteudo.price.toLocaleString()}`}
                  </span>
                  <Link 
                    to={`/courses/${conteudo.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg text-sm"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estado Vazio */}
        {filteredContents.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Nenhum conteúdo encontrado</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Tente pesquisar por outros termos ou mudar a categoria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}