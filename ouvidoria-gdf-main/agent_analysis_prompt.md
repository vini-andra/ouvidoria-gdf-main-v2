# Prompt para Análise Completa de PWA (Participa DF)

**Role:** Senior QA Engineer & UX/UI Accessibility Specialist
**Context:** Você está analisando o "Participa DF", um PWA (Progressive Web App) desenvolvido para a Ouvidoria do Governo do Distrito Federal. O objetivo principal é garantir que a aplicação seja acessível, robusta, visualmente "premium" e funcionalmente completa, atendendo a critérios rigorosos de um edital de Hackathon.
**Standards:** WCAG 2.1 Level AA, Design Responsivo, PWA Best Practices.

---

## 🎯 Objetivo Principal
Realizar uma auditoria exaustiva da aplicação em execução, identificando erros de design, falhas de acessibilidade, bugs estruturais e pontos de melhoria na experiência do usuário (UX). Você deve simular o comportamento de um usuário real em dois cenários distintos (Desktop e Mobile).

---

## 🔄 Workflows de Execução

Peço que execute **sequencialmente** os dois workflows abaixo para capturar dados completos:

### 🖥️ Workflow 1: Auditoria Versão Desktop (1920x1080)
1.  **Acesso & Auth**: Entre na página inicial. Tente navegar sem logar. Em seguida, faça login/cadastro.
2.  **Dashboard**: Verifique a hierarquia visual, o carregamento dos cards de manifestações recentes e a clareza das informações.
3.  **Nova Manifestação (Fluxo Complexo)**:
    *   Inicie o wizard de nova manifestação.
    *   Tente avançar sem preencher campos obrigatórios (teste de validação).
    *   Anexe múltiplos arquivos (Áudio, Imagem e Vídeo) simultaneamente.
    *   Marque a localização no mapa (se disponível).
    *   Conclua o envio e verifique o feedback visual.
4.  **Acompanhamento**: Acesse a manifestação criada. Verifique se o player de áudio funciona, se a imagem abre e se o vídeo tem o link de download correto.
5.  **Offline (Simulação)**: Se possível, desconecte a rede e tente navegar ou criar um rascunho. Verifique se a aplicação informa sobre o estado offline.

### 📱 Workflow 2: Auditoria Versão Mobile (375x812 - Ex: iPhone X/12/13)
1.  **Responsividade & Layout**:
    *   Verifique se o Header está correto e se o título "Participa DF" é clicável e leva para a Home.
    *   Analise o menu de navegação (Hambúrguer ou Bottom Bar) - é fácil de tocar? (Touch targets > 44px).
    *   Verifique a lista de manifestações: O protocolo está truncado? As informações estão empilhadas verticalmente para leitura fácil?
2.  **Interação Tátil**:
    *   Os botões são grandes o suficiente?
    *   Os inputs de formulário dão zoom indesejado ao focar? (Fonte deve ser >= 16px).
3.  **Mídia**: Tente reproduzir o áudio e visualizar imagens em tela pequena. O layout quebra?

---

## 📋 Critérios de Avaliação (Checklist)

Para cada erro encontrado, classifique a severidade (Crítico, Alto, Médio, Baixo).

### 1. 🎨 Design & UI (Aesthetics)
*   **Visual Premium**: A interface parece moderna e profissional (Shadcn UI)? Ou parece um "site governamental antigo"?
*   **Consistência**: As cores, tipografia e espaçamentos são consistentes em todas as páginas?
*   **Dark Mode**: Ative o modo escuro. O contraste é mantido? O banner azul/amarelo do GDF se adapta bem?
*   **Feedback**: Existem loadings (skeletons), toasts de sucesso/erro e estados de vazio (empty states) claros?

### 2. ♿ Acessibilidade (WCAG 2.1 AA)
*   **Contraste**: Textos sobre fundos coloridos (ex: botões, badges) têm contraste suficiente (mínimo 4.5:1)?
*   **Semântica**: O HTML usa tags corretas (`<main>`, `<nav>`, `<h1>` unico, buttons vs links)?
*   **Leitores de Tela**: Imagens têm `alt`? Ícones decorativos têm `aria-hidden="true"`? Botões apenas com ícone têm `aria-label`?
*   **Navegação por Teclado**: É possível usar todo o site apenas com `Tab` e `Enter`? O foco é visível?

### 3. 🏗️ Estrutural & PWA
*   **Performance**: O carregamento inicial é rápido? (Lighthouse Performance > 90 é o ideal).
*   **Instalação**: O prompt de instalação do PWA aparece? O manifesto está correto (`theme_color`, ícones)?
*   **Erro Handling**: Mensagens de erro são amigáveis ("Ocorreu um erro" vs "Não foi possível conectar ao servidor")?

---

## 📤 Formato de Saída Esperado

Gere um relatório estruturado em Markdown contendo:

1.  **Resumo Executivo**: Nota geral de 0 a 10 para o App.
2.  **Top 3 Problemas Críticos**: O que precisa ser corrigido urgentemente "conforme o edital".
3.  **Relatório Detalhado por Categoria**:
    *   **Design**: [Lista de issues com screenshots se possível]
    *   **Acessibilidade**: [Lista de violações WCAG]
    *   **Mobile**: [Problemas específicos da versão celular]
4.  **Sugestões de Melhoria**: O que pode ser feito para elevar o nível da aplicação para "Estado da Arte".

---
*Use este prompt para guiar sua análise profunda do PWA.*
