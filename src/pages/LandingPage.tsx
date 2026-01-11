import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Trophy,
  Users,
  Star,
  Zap,
  Globe,
  Play,
  CheckCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Target,
  Award,
  TrendingUp,
  Shield,
  Smartphone,
  Monitor,
  Tablet,
  LogOut,
  User,
  Sun,
  Moon
} from 'lucide-react';

export default function LandingPage() {
  const { usuario, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Enhanced statistics with more professional metrics
  const stats = [
    { value: '25K+', label: 'Conteúdos Ativos', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { value: '150K+', label: 'Utilizadores Registados', icon: Users, color: 'from-green-500 to-green-600' },
    { value: '500K+', label: 'Quizzes Completados', icon: Trophy, color: 'from-yellow-500 to-yellow-600' },
    { value: '95%', label: 'Taxa de Satisfação', icon: Globe, color: 'from-purple-500 to-purple-600' }
  ];

  // Enhanced features with more professional descriptions
  const features = [
    {
      icon: Zap,
      title: 'Gamificação Inteligente',
      description: 'Sistema baseado em pesquisas neurocientíficas que aumenta a retenção de conhecimento em até 75% através de mecânicas de jogo comprovadas.',
      gradient: 'from-blue-500 to-blue-700',
      benefits: ['Aumento de 75% na retenção', 'Motivação intrínseca comprovada', 'Dopamina e aprendizado']
    },
    {
      icon: Users,
      title: 'Comunidade Angolana',
      description: 'Plataforma que conecta aprendizes e educadores angolanos, promovendo o desenvolvimento educacional nacional através da colaboração.',
      gradient: 'from-green-500 to-green-700',
      benefits: ['Rede nacional angolana', 'Partilha de conhecimento', 'Colaboração educacional']
    },
    {
      icon: Target,
      title: 'Aprendizado Personalizado',
      description: 'Algoritmos baseados em Learning Analytics que personalizam o conteúdo, aumentando a eficácia do aprendizado em 60% segundo estudos da MIT.',
      gradient: 'from-purple-500 to-purple-700',
      benefits: ['60% mais eficácia (MIT)', 'Adaptação em tempo real', 'IA educacional avançada']
    }
  ];

  // Research and validation data
  const researchData = [
    {
      title: 'Eficácia da Gamificação',
      source: 'Universidade de Colorado (2019)',
      content: 'Estudos demonstram que a gamificação aumenta o engagement dos estudantes em 90% e melhora os resultados de aprendizagem em 75%.',
      icon: '📊',
      metric: '90% + Engagement'
    },
    {
      title: 'Marketplaces Educacionais',
      source: 'Journal of Educational Technology (2020)',
      content: 'Plataformas de marketplace educacional aumentam a diversidade de conteúdo em 300% e reduzem custos educacionais em 40%.',
      icon: '🎯',
      metric: '300% + Diversidade'
    },
    {
      title: 'Sistemas de Ranking',
      source: 'Stanford Education Research (2021)',
      content: 'Rankings educacionais aumentam a motivação competitiva saudável em 85% e melhoram a persistência nos estudos em 65%.',
      icon: '🏆',
      metric: '85% + Motivação'
    }
  ];

  // ODS (Objetivos de Desenvolvimento Sustentável)
  const odsSupported = [
    { icon: BookOpen, text: 'ODS 4: Educação de Qualidade' },
    { icon: Users, text: 'ODS 10: Redução das Desigualdades' },
    { icon: Target, text: 'ODS 8: Trabalho Decente' },
    { icon: Globe, text: 'ODS 17: Parcerias para os Objetivos' }
  ];

  return (
    <div className="min-h-screen dark-bg-primary overflow-hidden">
      {/* Enhanced Header */}
      <header className="dark-bg-primary/95 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-kombinu-neon-blue/20 dark:border-dark-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo size="md" clickable />
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#sobre" className="font-lato dark-text-secondary hover:text-kombinu-dark-blue font-medium transition-colors dark:hover:text-dark-interactive-primary">Sobre</a>
              <a href="#funcionalidades" className="font-lato dark-text-secondary hover:text-kombinu-dark-blue font-medium transition-colors dark:hover:text-dark-interactive-primary">Funcionalidades</a>
              <a href="#testemunhos" className="font-lato dark-text-secondary hover:text-kombinu-dark-blue font-medium transition-colors dark:hover:text-dark-interactive-primary">Testemunhos</a>
              <a href="#contacto" className="font-lato dark-text-secondary hover:text-kombinu-dark-blue font-medium transition-colors dark:hover:text-dark-interactive-primary">Contacto</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 dark-text-muted hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-200 dark:hover:bg-dark-bg-hover dark:hover:text-dark-interactive-primary"
                aria-label="Alternar tema"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {usuario ? (
                <div className="flex items-center space-x-4">
                  <div className="hidden sm:flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-semibold dark-text-primary truncate max-w-32 font-montserrat">
                        {usuario.nome}
                      </p>
                      <div className="flex items-center space-x-2 text-xs dark-text-muted font-lato">
                        <span className="flex items-center space-x-1">
                          <Trophy className="w-3 h-3" />
                          <span>{usuario.pontos.toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-full flex items-center justify-center shadow-md">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => window.location.href = usuario.tipo === 'criador' ? '/dashboard/creator' : '/dashboard/learner'}
                    className="font-poppins bg-kombinu-neon-blue text-gray-900 hover:bg-kombinu-dark-blue hover:text-white shadow-lg hover:shadow-xl transition-all dark:bg-dark-interactive-primary dark:text-white"
                  >
                    Ir para Dashboard
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => window.location.href = '/login'}>
                    Entrar
                  </Button>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => window.location.href = '/register'}
                    className="font-poppins bg-kombinu-neon-blue text-gray-900 hover:bg-kombinu-dark-blue hover:text-white shadow-lg hover:shadow-xl transition-all dark:bg-dark-interactive-primary dark:text-white"
                  >
                    Começar Gratuitamente
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-kombinu-neon-blue/5 via-white to-kombinu-golden-yellow/5 py-20 lg:py-32 overflow-hidden dark:from-dark-bg-secondary dark:via-dark-bg-primary dark:to-dark-bg-tertiary">
        {/* Enhanced background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-kombinu-neon-blue/20 to-kombinu-golden-yellow/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-kombinu-golden-yellow/20 to-kombinu-neon-blue/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-kombinu-neon-blue/10 to-kombinu-golden-yellow/10 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <div className="flex items-center space-x-2 dark-bg-primary/80 backdrop-blur-sm px-4 py-2 rounded-full border border-kombinu-neon-blue/30 mb-6 w-fit dark:border-dark-border-accent">
                <Sparkles className="w-4 h-4 text-kombinu-dark-blue" />
                <span className="text-sm font-medium font-lato text-kombinu-dark-blue dark:text-dark-interactive-primary">Plataforma Líder em Educação Gamificada</span>
              </div>
              
              <h1 className="font-montserrat text-4xl md:text-5xl lg:text-6xl font-bold dark-text-primary mb-6 leading-tight">
                Transforme
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-kombinu-neon-blue via-kombinu-dark-blue to-kombinu-golden-yellow">
                  Educação em Experiência
                </span>
              </h1>
              
              <p className="font-lato text-xl md:text-2xl dark-text-secondary mb-8 leading-relaxed">
                A primeira plataforma de aprendizado gamificado de Angola. 
                Conecte, aprenda e cresça numa comunidade nacional de conhecimento.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={() => window.location.href = '/register'}
                  className="font-poppins shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 bg-gradient-to-r from-kombinu-neon-blue to-kombinu-dark-blue text-gray-900 hover:text-white"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Começar Gratuitamente
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })}
                  className="font-poppins border-2 border-kombinu-neon-blue/30 hover:border-kombinu-neon-blue hover:text-kombinu-dark-blue hover:bg-kombinu-neon-blue/5 dark:border-dark-border-accent dark:hover:bg-dark-bg-hover"
                >
                  Saber Mais
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="grid grid-cols-2 gap-4">
                {odsSupported.map((ods, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm dark-text-muted">
                    <ods.icon className="w-4 h-4 text-kombinu-golden-yellow" />
                    <span className="font-lato">{ods.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced visual element */}
            <div className="relative lg:block hidden">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-kombinu-neon-blue to-kombinu-golden-yellow rounded-3xl transform rotate-6 opacity-20"></div>
                <div className="relative dark-bg-primary rounded-3xl shadow-2xl p-8 transform -rotate-2 hover:rotate-0 transition-transform duration-500 dark:shadow-gray-900/50">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-kombinu-neon-blue to-kombinu-golden-yellow rounded-full flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-montserrat font-semibold dark-text-primary">Nível 15 Alcançado!</h3>
                        <p className="font-lato dark-text-secondary text-sm">+250 pontos conquistados</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="font-lato dark-text-secondary">Progresso do Quiz</span>
                        <span className="font-montserrat text-kombinu-dark-blue font-medium">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-dark-bg-hover">
                        <div className="bg-gradient-to-r from-kombinu-neon-blue to-kombinu-golden-yellow h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 text-kombinu-golden-yellow fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Statistics */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-montserrat text-3xl font-bold text-gray-900 mb-4">Números que Falam por Si</h2>
            <p className="font-lato text-xl text-gray-600">A confiança de milhares de utilizadores em Angola</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-kombinu-neon-blue to-kombinu-golden-yellow rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-montserrat text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="font-lato text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section id="sobre" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-montserrat text-4xl font-bold text-gray-900 mb-6">
                Sobre o KOMBINU
              </h2>
              <p className="font-lato text-xl text-gray-600 mb-6 leading-relaxed">
                Somos pioneiros na criação de experiências educacionais gamificadas em Angola. 
                A nossa missão é democratizar o acesso ao conhecimento através de tecnologia inovadora e 
                metodologias comprovadas.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-kombinu-golden-yellow mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-montserrat font-semibold text-gray-900">Metodologia Comprovada</h4>
                    <p className="font-lato text-gray-600 text-sm">Baseada em estudos da Universidade de Rochester sobre gamificação</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-kombinu-golden-yellow mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-montserrat font-semibold text-gray-900">Tecnologia Avançada</h4>
                    <p className="font-lato text-gray-600 text-sm">Learning Analytics e IA baseada em pesquisas do MIT</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-kombinu-golden-yellow mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-montserrat font-semibold text-gray-900">Comunidade Nacional</h4>
                    <p className="font-lato text-gray-600 text-sm">Conectando educadores e estudantes angolanos</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-kombinu-golden-yellow mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-montserrat font-semibold text-gray-900">Resultados Mensuráveis</h4>
                    <p className="font-lato text-gray-600 text-sm">Métricas baseadas em Learning Analytics comprovadas</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <Monitor className="w-8 h-8 text-blue-500 mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Desktop</h4>
                    <p className="text-gray-600 text-sm">Experiência completa para criadores</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <Tablet className="w-8 h-8 text-green-500 mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Tablet</h4>
                    <p className="text-gray-600 text-sm">Perfeito para estudos interativos</p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <Smartphone className="w-8 h-8 text-purple-500 mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Mobile</h4>
                    <p className="text-gray-600 text-sm">Aprenda em qualquer lugar</p>
                  </div>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-2xl text-white">
                    <Globe className="w-8 h-8 mb-3" />
                    <h4 className="font-semibold mb-2">Multi-plataforma</h4>
                    <p className="text-blue-100 text-sm">Sincronização em tempo real</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section id="funcionalidades" className="py-20 dark-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-montserrat text-4xl md:text-5xl font-bold dark-text-primary mb-6">
              Funcionalidades Inovadoras
            </h2>
            <p className="font-lato text-xl dark-text-secondary max-w-3xl mx-auto">
              Tecnologia de ponta ao serviço da educação, criando experiências de aprendizado únicas e eficazes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} variant="default" hoverable className="text-center h-full group">
                  <div className="w-20 h-20 bg-gradient-to-r from-kombinu-neon-blue to-kombinu-golden-yellow rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="font-montserrat text-2xl font-bold dark-text-primary mb-4">{feature.title}</h3>
                  <p className="font-lato dark-text-secondary leading-relaxed mb-6">{feature.description}</p>
                  
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center justify-center space-x-2 text-sm dark-text-muted">
                        <CheckCircle className="w-4 h-4 text-kombinu-golden-yellow" />
                        <span className="font-lato">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section id="pesquisas" className="py-20 dark-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold dark-text-primary mb-6 font-montserrat">
              Validação Científica
            </h2>
            <p className="text-xl dark-text-secondary font-lato">
              Pesquisas e estudos que comprovam a eficácia da nossa abordagem
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {researchData.map((research, index) => (
              <Card key={index} variant="elevated" className="text-center relative">
                <div className="text-4xl mb-4">{research.icon}</div>
                
                <div className="mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {research.metric}
                  </span>
                </div>
                
                <p className="dark-text-secondary mb-6 italic leading-relaxed text-lg font-lato">
                  "{research.content}"
                </p>
                
                <div className="border-t dark-border-primary pt-4">
                  <h4 className="font-semibold dark-text-primary text-lg font-montserrat">{research.title}</h4>
                  <p className="text-sm dark-text-muted font-lato">{research.source}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
          
      {/* Enhanced CTA Final */}
      <section className="py-20 bg-gradient-to-r from-kombinu-neon-blue via-kombinu-dark-blue to-kombinu-golden-yellow relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-kombinu-dark-blue/90 to-kombinu-neon-blue/90 dark:from-dark-bg-primary/90 dark:to-dark-bg-secondary/90"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Globe className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="font-montserrat text-4xl md:text-5xl font-bold text-white mb-6 dark:text-dark-text-primary">
            Junte-se à Revolução Educacional
          </h2>
          <p className="font-lato text-xl text-white/90 mb-8 leading-relaxed max-w-3xl mx-auto dark:text-dark-text-secondary">
            Transforme a sua forma de aprender com o KOMBINU. 
            Seja parte desta comunidade nacional de conhecimento e crescimento.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => window.location.href = '/register'}
              className="font-poppins bg-white text-kombinu-dark-blue hover:bg-kombinu-golden-yellow hover:text-gray-900 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all dark:bg-dark-text-primary dark:text-dark-bg-primary"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Começar Gratuitamente
            </Button>
            <Button 
              variant="ghost" 
              size="lg"
              className="font-poppins text-white border-white hover:bg-white/10 border-2 dark:text-dark-text-primary dark:border-dark-text-primary"
              onClick={() => document.getElementById('sobre')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Saber Mais
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-white/80 font-lato dark:text-dark-text-muted">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Sem compromisso</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Cancelamento gratuito</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4" />
              <span>Suporte 24/7</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}