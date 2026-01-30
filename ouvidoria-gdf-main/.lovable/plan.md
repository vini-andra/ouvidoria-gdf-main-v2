# Plano de Implementação: Fluxo de Manifestação em Etapas (Wizard)

## Visão Geral

Vou reestruturar a página de manifestação para seguir um fluxo de etapas guiado (wizard) com uma barra de progresso vertical no lado esquerdo, conforme a imagem de referência da plataforma oficial da Ouvidoria. Este fluxo seguirá as recomendações do relatório de análise.

---

## Nova Estrutura de Etapas

Com base na análise dos documentos, o novo fluxo terá **7 etapas**:

| Etapa | Nome                           | Descrição                                                       |
| ----- | ------------------------------ | --------------------------------------------------------------- |
| 1     | **Relato**                     | Texto livre (ou seleção de mídia: áudio/imagem/vídeo)           |
| 2     | **Assunto**                    | Tipo de manifestação + Órgão responsável (com sugestões da IZA) |
| 3     | **Informações Complementares** | Local, data, envolvidos, testemunhas                            |
| 4     | **Resumo**                     | Revisão de todos os dados antes de prosseguir                   |
| 5     | **Identificação**              | Anônimo ou identificado (login/cadastro se necessário)          |
| 6     | **Anexos**                     | Upload de arquivos adicionais (opcional)                        |
| 7     | **Protocolo**                  | Confirmação e geração do protocolo                              |

---

## Divisão em Etapas de Desenvolvimento

Para garantir qualidade e evitar erros, dividirei a implementação em **4 etapas de desenvolvimento**:

### Etapa 1: Infraestrutura do Wizard e Sidebar de Progresso ✅ CONCLUÍDA

**Escopo:**

- ✅ Criar componente `StepProgress` (sidebar vertical com indicadores visuais)
- ✅ Criar componente `ManifestacaoWizard` para gerenciar navegação entre etapas
- ✅ Criar hook `useManifestacaoWizard` para controlar estado das etapas
- ✅ Implementar layout responsivo (sidebar à esquerda em desktop, stepper no topo em mobile)
- ✅ Adicionar transições suaves entre etapas

**Arquivos criados/modificados:**

- `src/components/manifestacao/wizard/StepProgress.tsx` ✅
- `src/components/manifestacao/wizard/ManifestacaoWizard.tsx` ✅
- `src/hooks/useManifestacaoWizard.ts` ✅
- `src/pages/Manifestacao.tsx` ✅

### Etapa 2: Etapas de Conteúdo (Relato, Assunto, Info Complementares) ✅ CONCLUÍDA

**Escopo:**

- ✅ Criar componente `Step1Relato` (integra os canais existentes)
- ✅ Criar componente `Step2Assunto` (tipo de manifestação + órgão + sugestões IZA)
- ✅ Criar componente `Step3InfoComplementares` (campos estendidos)
- ✅ Implementar validação por etapa

**Arquivos criados:**

- `src/components/manifestacao/wizard/steps/Step1Relato.tsx` ✅
- `src/components/manifestacao/wizard/steps/Step2Assunto.tsx` ✅
- `src/components/manifestacao/wizard/steps/Step3InfoComplementares.tsx` ✅

### Etapa 3: Etapas de Revisão e Identificação (Resumo, Identificação, Anexos) ✅ CONCLUÍDA

**Escopo:**

- ✅ Criar componente `Step4Resumo` (resumo completo editável)
- ✅ Criar componente `Step5Identificacao` (toggle anônimo + campos de identificação)
- ✅ Criar componente `Step6Anexos` (upload de arquivos adicionais)
- ✅ Implementar lógica de fluxo condicional (pular etapas se não aplicável)

**Arquivos criados:**

- `src/components/manifestacao/wizard/steps/Step4Resumo.tsx` ✅
- `src/components/manifestacao/wizard/steps/Step5Identificacao.tsx` ✅
- `src/components/manifestacao/wizard/steps/Step6Anexos.tsx` ✅

### Etapa 4: Etapa Final e Integração ✅ CONCLUÍDA

**Escopo:**

- ✅ Criar componente `Step7Protocolo` (confirmação e protocolo)
- ✅ Integrar hook de envio com o wizard
- ✅ Implementar funcionalidade "Salvar Rascunho" (persistência local)
- ✅ Ocultar botões de navegação após envio bem-sucedido
- ✅ Exibir protocolo, senha, QR Code e opções de compartilhamento

**Arquivos criados/modificados:**

- `src/components/manifestacao/wizard/steps/Step7Protocolo.tsx` ✅
- `src/hooks/useDraftPersistence.ts` ✅
- `src/hooks/useManifestacaoForm.ts` ✅
- `src/pages/Manifestacao.tsx` ✅
- `src/components/manifestacao/wizard/ManifestacaoWizard.tsx` ✅

---

## Detalhes Técnicos

### Componente StepProgress (Sidebar)

```text
+---------------------------+
|   [Logo Ouvidoria 162]    |
+---------------------------+
|  ● Relato       [ativo]   |
|  ○ Assunto                |
|  ○ Info Complementares    |
|  ○ Resumo                 |
|  ○ Identificação          |
|  ○ Anexos                 |
|  ○ Protocolo              |
+---------------------------+
```

- Estados visuais: Completo (check verde), Ativo (azul/destaque), Pendente (cinza)
- Clicável para voltar a etapas anteriores (não para avançar)
- ARIA labels para acessibilidade
- Responsivo: em mobile vira stepper horizontal no topo

### Validação por Etapa

Cada etapa terá validação específica antes de permitir avançar:

- **Etapa 1**: Mínimo de caracteres ou mídia selecionada
- **Etapa 2**: Tipo e órgão selecionados
- **Etapa 3**: Opcional (pode avançar sem preencher)
- **Etapa 4**: Apenas revisão (sempre válido)
- **Etapa 5**: Se não anônimo, dados obrigatórios
- **Etapa 6**: Opcional
- **Etapa 7**: Envio final

### Melhorias de Acessibilidade (WCAG 2.1 AA)

- Indicador de progresso com aria-label
- Navegação por teclado entre etapas
- Mensagens de erro acessíveis com role="alert"
- Foco automático no primeiro campo de cada etapa
- Contraste adequado em todos os estados

---

## Próximos Passos

Solicito sua aprovação para iniciar a **Etapa 1** do desenvolvimento:

- Criar a infraestrutura do wizard com a sidebar de progresso
- Implementar o layout responsivo
- Configurar o hook de gerenciamento de estado

Após completar cada etapa, apresentarei o resultado e aguardarei aprovação antes de prosseguir para a próxima.
