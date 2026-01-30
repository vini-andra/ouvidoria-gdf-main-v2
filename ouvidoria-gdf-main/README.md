# 🏛️ Ouvidoria Digital GDF

<div align="center">

![Ouvidoria Digital Banner](public/banner-ouvidoria-1.png)

**Plataforma moderna, acessível e multicanal de ouvidoria para o Governo do Distrito Federal**

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![Tests](https://img.shields.io/badge/tests-46%20passing-success)](package.json)
[![Build](https://img.shields.io/badge/build-passing-success)](package.json)
[![Accessibility](https://img.shields.io/badge/a11y-WCAG%202.1%20AA-success)](https://www.w3.org/WAI/WCAG21/quickref/)
[![PWA](https://img.shields.io/badge/PWA-ready-success)](https://web.dev/pwa/)

[Demo](https://deathghost-ai.github.io/ouvidoria-gdf/) · [Documentação](DEPLOYMENT_GDF.md) · [Testes](TESTING.md) · [Vídeo](ROTEIRO_VIDEO.md)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Demonstração](#-demonstração)
- [Tecnologias](#-tecnologias)
- [Diferenciais](#-diferenciais)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [Arquitetura](#-arquitetura)
- [Acessibilidade](#-acessibilidade)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

---

## 🎯 Sobre o Projeto

A **Ouvidoria Digital GDF** é uma solução completa e moderna para conectar cidadãos ao Governo do Distrito Federal, permitindo que manifestações, reclamações, sugestões, denúncias e elogios sejam registrados de forma simples, rápida e totalmente acessível.

### O Problema

Atualmente, cidadãos do Distrito Federal enfrentam:
- ❌ Canais de comunicação fragmentados e confusos
- ❌ Impossibilidade de acompanhar manifestações em tempo real
- ❌ Baixa acessibilidade para pessoas com deficiência
- ❌ Necessidade de deslocamento presencial
- ❌ Processos burocráticos e demorados

### Nossa Solução

A Ouvidoria Digital GDF resolve todos estes problemas com:
- ✅ **Plataforma 100% digital** - Acesso via web, mobile e PWA
- ✅ **Multi-canal** - Texto, áudio, imagem ou vídeo
- ✅ **Acompanhamento em tempo real** - Protocolo único e timeline de status
- ✅ **Acessibilidade completa** - WCAG 2.1 Level AA, VLibras, navegação por teclado
- ✅ **Funciona offline** - PWA com sincronização automática
- ✅ **Inteligência artificial** - Assistente IZA sugere categorias e órgãos

---

## ✨ Funcionalidades

### Para Cidadãos

#### 📝 Registro de Manifestações Multi-canal
- **Texto** - Escreva sua manifestação (mín. 50 caracteres)
- **Áudio** - Grave uma mensagem de voz
- **Imagem** - Envie fotos do problema
- **Vídeo** - Compartilhe vídeos (máx. 50MB)

#### 🤖 Assistente Inteligente IZA
- Sugestões automáticas de categoria
- Indicação do órgão responsável correto
- Orientações sobre o processo

#### 🔒 Privacidade e Segurança
- **Manifestação anônima** - Para denúncias sensíveis
- **Manifestação identificada** - Com acompanhamento por email
- Dados protegidos com Row Level Security (RLS)

#### 📊 Acompanhamento em Tempo Real
- Protocolo único gerado automaticamente
- QR Code para consulta rápida
- Timeline de status (aguardando → em análise → respondida)
- Email profissional com link de tracking
- Notificações de mudança de status

#### 💼 Dashboard Pessoal
- Visualização de todas as manifestações
- Filtros por status, categoria, órgão
- Histórico completo de interações
- Download de comprovantes

### Para o Governo

#### 📥 Gestão Centralizada
- Painel administrativo completo
- Categorização automática por IA
- Roteamento para órgãos responsáveis
- Métricas e relatórios em tempo real

#### 📧 Comunicação Automatizada
- Email profissional com protocolo
- Templates personalizáveis
- Tracking de envios e abertura
- Retry automático com backoff

#### 📈 Analytics e Auditoria
- Logs completos de todas as ações
- Estatísticas por categoria, órgão, período
- Taxa de resposta e tempo médio
- Export de dados para relatórios

---

## 🎬 Demonstração

### Tela Inicial
Interface limpa e intuitiva com call-to-action claro para registrar manifestação.

![Home](docs/screenshots/home.png)

### Wizard de Manifestação
Processo guiado em 7 passos para garantir que todas as informações necessárias sejam coletadas.

![Wizard](docs/screenshots/wizard.png)

### Dashboard do Cidadão
Acompanhamento completo de todas as manifestações em um só lugar.

![Dashboard](docs/screenshots/dashboard.png)

### Acessibilidade VLibras
Tradução automática em LIBRAS para inclusão de pessoas surdas.

![VLibras](docs/screenshots/vlibras.png)

---

## 🛠️ Tecnologias

### Frontend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| **React** | 18.3.1 | Library principal para UI |
| **TypeScript** | 5.8.3 | Tipagem estática e type safety |
| **Vite** | 5.4.19 | Build tool e dev server |
| **Tailwind CSS** | 3.4.1 | Estilização utilitária |
| **shadcn/ui** | Latest | Componentes acessíveis |
| **React Router** | 7.5.0 | Roteamento SPA |
| **React Query** | 5.64.2 | Cache e estado assíncrono |

### Backend

| Tecnologia | Uso |
|------------|-----|
| **Supabase** | BaaS completo (PostgreSQL + Auth + Storage) |
| **Edge Functions** | Serverless functions (Deno) |
| **PostgreSQL** | Banco de dados relacional |
| **Row Level Security** | Segurança a nível de linha |

### PWA e Offline

| Tecnologia | Uso |
|------------|-----|
| **Vite PWA** | Service Worker e manifest |
| **IndexedDB** | Armazenamento local offline |
| **Workbox** | Estratégias de cache |

### Qualidade de Código

| Ferramenta | Uso |
|------------|-----|
| **ESLint** | Linting e regras de código |
| **Prettier** | Formatação consistente |
| **Vitest** | Framework de testes unitários |
| **Testing Library** | Testes de componentes React |
| **Husky** | Git hooks (pre-commit) |
| **lint-staged** | Lint apenas em staged files |

### Comunicação

| Tecnologia | Uso |
|------------|-----|
| **Resend** | Serviço de envio de emails |
| **Email Templates** | HTML responsivo para emails |

---

## 🚀 Diferenciais

### Inovação Tecnológica

1. **🤖 Inteligência Artificial (IZA)**
   - Categorização automática de manifestações
   - Sugestão de órgãos responsáveis
   - Análise de sentimento (futuro)

2. **📱 Progressive Web App (PWA)**
   - Instalável como app nativo
   - Funciona 100% offline
   - Sincronização automática ao reconectar
   - Push notifications (futuro)

3. **♿ Acessibilidade WCAG 2.1 Level AA**
   - VLibras para tradução em LIBRAS
   - Navegação completa por teclado
   - Compatibilidade com leitores de tela (NVDA, JAWS, VoiceOver)
   - Alto contraste e controle de tamanho de fonte
   - Skip links para navegação rápida

4. **📊 Multi-canal de Comunicação**
   - Primeiro sistema de ouvidoria com suporte a 4 formatos
   - Reduz barreiras de comunicação
   - Aumenta engajamento cidadão

### Qualidade e Segurança

- ✅ **46 testes automatizados** (100% crítico coberto)
- ✅ **TypeScript strict mode** (zero type errors)
- ✅ **ESLint + Prettier** configurados
- ✅ **Pre-commit hooks** para garantir qualidade
- ✅ **Row Level Security** no banco de dados
- ✅ **Rate limiting** em APIs sensíveis
- ✅ **Retry logic** com exponential backoff
- ✅ **Audit logs** completos

### Performance

- ⚡ **Build otimizado** (code splitting, tree shaking)
- ⚡ **Lazy loading** de componentes
- ⚡ **Cache inteligente** (React Query + Service Worker)
- ⚡ **Imagens otimizadas** (webp, lazy load)
- ⚡ **Bundle size** controlado

---

## 📦 Instalação

### Pré-requisitos

- **Node.js** 18+ e npm
- **Git** para controle de versão
- Conta no **Supabase** (criar em [supabase.com](https://supabase.com))

### Passo a Passo

1. **Clone o repositório**

```bash
git clone https://github.com/deathghost-ai/ouvidoria-gdf.git
cd ouvidoria-gdf/ouvidoria-gdf-main
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
```

4. **Configure o banco de dados**

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref seu-projeto-ref

# Executar migrações
supabase db push

# Carregar dados de teste (opcional)
supabase db reset
```

5. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173)

---

## 🎯 Uso

### Desenvolvimento

```bash
# Iniciar dev server
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Rodar testes
npm test

# Lint
npm run lint

# Format
npm run format
```

### Testes

```bash
# Rodar todos os testes
npm test

# Testes em watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

**Resultado esperado**: 46/46 testes passando

### Deploy

Consulte o guia completo de deployment: [`DEPLOYMENT_GDF.md`](DEPLOYMENT_GDF.md)

**Opções de deployment**:
- GitHub Pages (MVP/teste)
- Vercel (recomendado para produção)
- Netlify
- Servidor próprio

---

## 🏗️ Arquitetura

### Estrutura de Pastas

```
ouvidoria-gdf-main/
├── public/               # Assets estáticos
├── src/
│   ├── components/       # Componentes React
│   │   ├── ui/          # Componentes base (shadcn)
│   │   ├── auth/        # Componentes de autenticação
│   │   ├── manifestacao/ # Wizard de manifestação
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilitários e services
│   ├── pages/           # Páginas da aplicação
│   ├── integrations/    # Integrações (Supabase)
│   └── ...
├── supabase/
│   ├── functions/       # Edge Functions (Deno)
│   └── migrations/      # Migrações SQL
├── tests/               # Testes
└── ...
```

### Fluxo de Dados

```
┌─────────────┐
│   Cidadão   │
└──────┬──────┘
       │
       v
┌─────────────────┐
│  React Frontend │ ← PWA (Service Worker)
└────────┬────────┘
         │
         v
┌─────────────────┐
│    Supabase     │
│   (Backend)     │
├─────────────────┤
│ • PostgreSQL    │
│ • Auth          │
│ • Storage       │
│ • Edge Functions│
└─────────────────┘
```

### Componentes Principais

1. **`ManifestacaoWizard`** - Wizard de 7 passos
   - Gerenciamento de estado com `useManifestacaoWizard`
   - Validação com `useManifestacaoValidation`
   - Submissão com `useManifestacaoForm`

2. **`Dashboard`** - Painel do cidadão
   - Lista de manifestações
   - Filtros e busca
   - Detalhamento de status

3. **`Acompanhamento`** - Consulta de manifestação
   - Por protocolo + senha
   - Por CPF (autenticado)
   - Timeline de status

4. **`ErrorBoundary`** - Tratamento de erros
   - Captura erros em toda a árvore
   - Fallback UI amigável
   - Log estruturado

---

## ♿ Acessibilidade

A aplicação segue rigorosamente as diretrizes **WCAG 2.1 Level AA**:

### Recursos Implementados

| Recurso | Descrição | Nível |
|---------|-----------|-------|
| **VLibras** | Tradução em LIBRAS | AA |
| **Navegação por teclado** | Tab, Enter, Esc | AA |
| **Leitores de tela** | ARIA labels, roles, live regions | AA |
| **Contraste** | Mínimo 4.5:1 para texto | AA |
| **Controle de fonte** | Aumentar/diminuir tamanho | AAA |
| **Skip links** | Pular para conteúdo principal | A |
| **Foco visível** | Outline em todos os elementos | AA |

### Testes de Acessibilidade

- ✅ NVDA (Windows)
- ✅ JAWS (Windows)
- ✅ VoiceOver (macOS/iOS)
- ✅ TalkBack (Android)
- ✅ Navegação completa por teclado
- ✅ Lighthouse score 100/100

Consulte o guia de testes: [`TESTING.md`](TESTING.md)

---

## 📊 Testes

### Cobertura

| Módulo | Testes | Cobertura |
|--------|--------|-----------|
| `useManifestacaoWizard` | 28 | 100% |
| `useAuth` | 11 | 100% |
| `useOfflineQueue` | 6 | 85% |
| `Validations` | Built-in | 100% |
| **Total** | **46** | **95%+** |

### Executar Testes

```bash
# Todos os testes
npm test

# Watch mode
npm run test:watch

# Com coverage
npm run test:coverage
```

### Dados de Teste

Carregue dados realistas para testes:

```bash
supabase db reset  # Limpa banco
# Seed automático carrega 12 órgãos e 10 manifestações
```

Consulte [`TESTING.md`](TESTING.md) para cenários completos.

---

## 🚀 Deploy

### Produção Rápida

**Vercel** (recomendado):

```bash
npm install -g vercel
vercel --prod
```

**Netlify**:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Configuração Completa

Consulte o guia detalhado: [`DEPLOYMENT_GDF.md`](DEPLOYMENT_GDF.md)

**Checklist de deploy**:
- [ ] Variáveis de ambiente configuradas
- [ ] Migrações executadas
- [ ] Edge Functions deployed
- [ ] Email (Resend) configurado
- [ ] Domínio configurado
- [ ] SSL ativo
- [ ] Testes de produção passando

---

## 📚 Documentação

- **[DEPLOYMENT_GDF.md](DEPLOYMENT_GDF.md)** - Guia completo de deployment para o GDF
- **[TESTING.md](TESTING.md)** - Guia de testes e dados de teste
- **[ROTEIRO_VIDEO.md](ROTEIRO_VIDEO.md)** - Roteiro para vídeo de apresentação
- **[Edital.md](Edital.md)** - Requisitos do hackathon

---

## 👥 Contribuição

Contribuições são bem-vindas! Siga estes passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de Código

- ✅ TypeScript strict mode
- ✅ ESLint + Prettier
- ✅ Testes para novas funcionalidades
- ✅ Documentação atualizada
- ✅ Commits semânticos

### Pre-commit Hooks

O projeto usa Husky para garantir qualidade:

```bash
# Automático ao fazer commit
git add .
git commit -m "feat: nova funcionalidade"
# → ESLint + Prettier rodam automaticamente
```

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🙏 Agradecimentos

- **Hackathon Participa DF 2026** - Pela oportunidade
- **Governo do Distrito Federal** - Pela abertura à inovação
- **Comunidade Open Source** - Pelas ferramentas incríveis
- **shadcn/ui** - Pelos componentes acessíveis
- **Supabase** - Pelo backend completo e gratuito

---

## 📞 Contato

**Equipe de Desenvolvimento**
- Email: dev@participa-df.gov.br
- GitHub: [@deathghost-ai](https://github.com/deathghost-ai)

**Suporte**
- Email: suporte@participa-df.gov.br
- Issues: [GitHub Issues](https://github.com/deathghost-ai/ouvidoria-gdf/issues)

---

## 📊 Estatísticas do Projeto

![GitHub stars](https://img.shields.io/github/stars/deathghost-ai/ouvidoria-gdf?style=social)
![GitHub forks](https://img.shields.io/github/forks/deathghost-ai/ouvidoria-gdf?style=social)
![GitHub issues](https://img.shields.io/github/issues/deathghost-ai/ouvidoria-gdf)
![GitHub pull requests](https://img.shields.io/github/issues-pr/deathghost-ai/ouvidoria-gdf)

---

<div align="center">

**Feito com ❤️ para os cidadãos do Distrito Federal**

[⬆ Voltar ao topo](#️-ouvidoria-digital-gdf)

</div>
