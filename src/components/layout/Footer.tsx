/**
 * Componente Footer da aplicação
 * Rodapé com informações da empresa, links úteis e redes sociais
 */

import React from 'react';
import { Logo } from '../ui/Logo';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Heart,
  ExternalLink,
  Award,
  Shield
} from 'lucide-react';

/**
 * Footer responsivo com informações da empresa e links
 */
export const Footer: React.FC = () => {
  // Links de navegação organizados por categoria
  const footerSections = [
    {
      title: 'Produto',
      links: [
        { label: 'Funcionalidades', href: '#funcionalidades' },
        { label: 'Para Educadores', href: '#educadores' },
        { label: 'Para Estudantes', href: '#estudantes' },
        { label: 'Planos e Preços', href: '#precos' }
      ]
    },
    {
      title: 'Soluções',
      links: [
        { label: 'Ensino Superior', href: '#ensino-superior' },
        { label: 'Formação Corporativa', href: '#corporativo' },
        { label: 'Escolas Secundárias', href: '#secundario' },
        { label: 'Certificações', href: '#certificacoes' }
      ]
    },
    {
      title: 'Suporte',
      links: [
        { label: 'Central de Ajuda', href: '#ajuda' },
        { label: 'Contacto', href: '#contacto' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Estado do Sistema', href: '#status' }
      ]
    },
    {
      title: 'Empresa',
      links: [
        { label: 'Sobre Nós', href: '#sobre' },
        { label: 'Oportunidades', href: '#carreiras' },
        { label: 'Imprensa', href: '#imprensa' },
        { label: 'Parcerias', href: '#parceiros' }
      ]
    }
  ];

  // Informações de contato
  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'info@kombinu.com',
      href: 'mailto:info@kombinu.com'
    },
    {
      icon: Phone,
      label: 'Telefone',
      value: '+351 21 000 0000',
      href: 'tel:+351210000000'
    },
    {
      icon: MapPin,
      label: 'Endereço',
      value: 'Lisboa, Portugal',
      href: '#'
    }
  ];

  // Redes sociais
  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  return (
    <footer className="bg-gray-900 text-white dark:bg-dark-bg-primary dark:text-dark-text-primary">
      {/* Seção principal do footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Informações da empresa */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <Logo size="lg" className="text-white" />
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed dark:text-dark-text-secondary font-lato">
              Plataforma líder em educação gamificada para o mundo lusófono. 
              Conectamos educadores e estudantes através de tecnologia inovadora e metodologias comprovadas.
            </p>

            {/* Informações de contato */}
            <div className="space-y-3">
              {contactInfo.map((contact) => {
                const Icon = contact.icon;
                return (
                  <a
                    key={contact.label}
                    href={contact.href}
                    className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors group dark:text-dark-text-muted dark:hover:text-dark-text-primary font-lato"
                  >
                    <Icon className="w-4 h-4 text-blue-400 group-hover:text-blue-300" />
                    <span className="text-sm">{contact.value}</span>
                  </a>
                );
              })}
            </div>

            {/* Certificações e prémios */}
            <div className="mt-6 pt-6 border-t border-gray-700 dark:border-dark-border-primary">
              <div className="flex items-center space-x-4 text-sm text-gray-400 dark:text-dark-text-muted font-lato">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>ISO 27001</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>GDPR Compliant</span>
                </div>
              </div>
            </div>
            {/* Redes sociais */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all duration-200 dark:bg-dark-bg-secondary dark:hover:bg-dark-interactive-primary"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links de navegação */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerSections.map((section) => (
                <div key={section.title}>
                  <h3 className="text-lg font-semibold text-white mb-4 dark:text-dark-text-primary font-montserrat">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          className="text-gray-300 hover:text-white transition-colors text-sm flex items-center group dark:text-dark-text-muted dark:hover:text-dark-text-primary font-lato"
                        >
                          <span>{link.label}</span>
                          {link.href.startsWith('http') && (
                            <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          )}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-gray-800 dark:border-dark-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold text-white mb-2 dark:text-dark-text-primary font-montserrat">
                Newsletter KOMBINU
              </h3>
              <p className="text-gray-300 text-sm dark:text-dark-text-secondary font-lato">
                Receba insights educacionais, novidades da plataforma e dicas exclusivas
              </p>
            </div>
            
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="O seu melhor email"
                id="newsletter-email"
                className="flex-1 md:w-80 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-dark-bg-secondary dark:border-dark-border-primary dark:text-dark-text-primary font-lato"
              />
              <button 
                onClick={() => {
                  const email = (document.getElementById('newsletter-email') as HTMLInputElement)?.value;
                  if (email) {
                    // Enviar email para domagtech2023@gmail.com
                    const subject = 'Nova Subscrição Newsletter KOMBINU';
                    const body = `Nova subscrição da newsletter:\n\nEmail: ${email}\nData: ${new Date().toLocaleString('pt-AO')}\nOrigem: Landing Page KOMBINU`;
                    window.location.href = `mailto:domagtech2023@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  }
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-r-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 dark:bg-dark-interactive-primary dark:hover:bg-blue-700 font-poppins"
              >
                Subscrever
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 dark:border-dark-border-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-1 text-gray-400 text-sm mb-4 md:mb-0 dark:text-dark-text-muted font-lato">
              <span>© 2025 KOMBINU. Desenvolvido com</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>para o mundo lusófono.</span>
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="#privacidade" className="text-gray-400 hover:text-white transition-colors dark:text-dark-text-muted dark:hover:text-dark-text-primary font-lato">
                Política de Privacidade
              </a>
              <a href="#termos" className="text-gray-400 hover:text-white transition-colors dark:text-dark-text-muted dark:hover:text-dark-text-primary font-lato">
                Termos de Uso
              </a>
              <a href="#cookies" className="text-gray-400 hover:text-white transition-colors dark:text-dark-text-muted dark:hover:text-dark-text-primary font-lato">
                Política de Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};