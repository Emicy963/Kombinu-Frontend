# Changelog (Frontend)

Todas as mudanças notáveis do Frontend Kombinu serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [1.2.2] - Correções Adicionais do MVP (Março 2026)

### ✨ Adicionado

- Rodapé (Footer) atualizado com dados de contacto reais da Kombinu (Email, Telefone, e Localização em Angola).
- Formulário de subscrição da newsletter no frontend funcional e redigido corretamente para o novo e-mail da Kombinu.

### 🐛 Corrigido:

- Implementação end-to-end do fluxo de Criação Manual de Quizzes sem uso de IA, permitindo aos criadores submeterem perguntas digitadas manualmente para os servidores.
- Player de Quizzes consertado:
  - Resolvido Erro 500 no carregamento inicial devido a URLs e Lookup Fields descompassados no backend.
  - Sincronização de propriedades (ID vs PK) no modelo frontend-backend para resolver problemas visuais (temporizador `NaN` e inputs radio marcando todos simultaneamente).
  - Ajuste no envio de respostas do Quiz para garantir pontuação fiel ao modelo do backend.

## [1.2.1] - Criar um Ficheiro  `vercel.json` para Configurações de Deploy (Março 2026)

### ✨ Adicionado

- Ficheiro `vercel.json` criado para configurar o comportamento de deploy no Vercel, incluindo:
  - Redirecionamentos e rewrites para SPA
  - Variáveis de ambiente para produção

## [1.2.0] - Funcionalidades Finais do MVP (Março 2026)

### ✨ Adicionado

- Botão interativo para **Gerar Quiz via Inteligência Artificial (OpenTDB)** associado a conteúdos criados.
- Ligação de interface completa e limpa da página de `/courses/:id`, agora a renderizar os iFrames e textos descritivos inseridos pelos criadores.

### 🐛 Corrigido

- Correção de erro Crítico `undefined.toLocaleString()` no Marketplace quando o preço é vazio ou indefinido.
- O Frontend agora suporta corretamente a **Paginação do DRF**, garantindo que as listagens do Marketplace são populosas através do array `results`.
- Componente estático Ranking ligado de forma dinâmica via chamada API a `/api/rankings/global/`, calculando Score diretamente do Backend.
- Correção na Visualização de conteúdo provocada pelo parse incorreto das Tags armazenadas em formato CSV no lado do servidor (`.map is not a function`).
- Correção da configuração base global do Axios em `main.tsx` para se orientar corretamente através de `VITE_API_URL` usando instâncias em Vite para Deploys no _Vercel_.

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
