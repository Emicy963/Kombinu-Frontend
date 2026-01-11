# Changelog (Frontend)

Todas as mudanças notáveis do Frontend Kombinu serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [1.1.0] - 2026-01-11 (MVP Release)

### ✨ Adicionado

- **Arquitetura**

  - Migração completa de HTML legado para React 18 + TypeScript + Vite
  - Configuração de Tailwind CSS para estilização
  - React Router v7 para navegação SPA

- **Serviços de API** (`src/services/`)

  - `authService.ts` - Autenticação JWT (login/register)
  - `contentService.ts` - CRUD de conteúdos/cursos
  - `dashboardService.ts` - Estatísticas de Learner/Creator
  - `quizService.ts` - Geração e submissão de quizzes
  - `rankingService.ts` - Leaderboard global

- **Páginas Implementadas**

  - `LandingPage.tsx` - Página inicial com Dark Mode
  - `Login.tsx` / `Register.tsx` - Autenticação completa
  - `DashboardAprendiz.tsx` / `DashboardCriador.tsx` - Dashboards por role
  - `Marketplace.tsx` - Listagem de cursos com filtros
  - `Quiz.tsx` - Interface interativa de quizzes
  - `Ranking.tsx` - Leaderboard com tendências

- **UI/UX**
  - Dark Mode global com persistência
  - Componentes reutilizáveis (Card, Button, Header)
  - Design responsivo mobile-first

### 🐛 Corrigido

- Links de navegação do Dashboard (404 errors)
- Erros de compilação TypeScript em múltiplas páginas
- Configuração de proxy Vite para API local
- Imports ausentes de ícones Lucide

### 🔄 Alterado

- `dashboardService` atualizado para consumir endpoints reais
- `rankingService` conectado à API `/rankings/global/`
- `quizService` integrado com backend para submissão real
