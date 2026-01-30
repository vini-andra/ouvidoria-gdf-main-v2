# Guia de Testes - Ouvidoria Digital GDF

Este documento descreve como testar a aplicação com dados realistas.

## Índice

1. [Dados de Teste](#dados-de-teste)
2. [Carregar Seed Data](#carregar-seed-data)
3. [Cenários de Teste](#cenários-de-teste)
4. [Contas de Teste](#contas-de-teste)
5. [Testes Automatizados](#testes-automatizados)

---

## Dados de Teste

O arquivo [`supabase/seed.sql`](supabase/seed.sql) contém:

- **12 órgãos do GDF** (órgãos reais do governo)
- **10 manifestações realistas** (diversos tipos e status)
- **7 logs de email** (auditoria de envios)

### Órgãos Incluídos

| Sigla | Nome |
|-------|------|
| SES-DF | Secretaria de Estado de Saúde |
| SEEDF | Secretaria de Estado de Educação |
| SEMOB | Secretaria de Transporte e Mobilidade |
| SSP-DF | Secretaria de Segurança Pública |
| CEB | Companhia Energética de Brasília |
| CAESB | Companhia de Saneamento Ambiental |
| SODF | Secretaria de Obras e Infraestrutura |
| SEMA-DF | Secretaria do Meio Ambiente |
| SEDES | Secretaria de Desenvolvimento Social |
| DER-DF | Departamento de Estradas de Rodagem |
| NOVACAP | Companhia Urbanizadora |
| ADASA | Agência Reguladora |

### Tipos de Manifestações

- ✅ **Reclamações** (saúde, energia, documentação)
- ⚠️ **Denúncias** (educação, água, meio ambiente)
- 💡 **Sugestões** (transporte, acessibilidade)
- 👍 **Elogios** (atendimento policial)
- 📝 **Solicitações** (obras, infraestrutura)

---

## Carregar Seed Data

### Opção 1: Via Supabase CLI

```bash
# 1. Garantir que está conectado ao projeto
cd ouvidoria-gdf-main
supabase db reset  # Limpa e recria o banco

# 2. Aplicar seed
supabase db seed
```

### Opção 2: Via Supabase Dashboard

1. Acesse [app.supabase.com](https://app.supabase.com)
2. Selecione seu projeto
3. Vá em **SQL Editor**
4. Clique em **New Query**
5. Copie o conteúdo de `supabase/seed.sql`
6. Cole e clique em **Run**

### Opção 3: Via psql

```bash
# Conectar ao banco
psql -h db.XXXXXXXXXXXX.supabase.co \
     -U postgres \
     -d postgres \
     -f supabase/seed.sql
```

### Verificar Dados Carregados

```sql
-- Ver total de registros
SELECT
  (SELECT COUNT(*) FROM orgaos) as total_orgaos,
  (SELECT COUNT(*) FROM manifestacoes) as total_manifestacoes,
  (SELECT COUNT(*) FROM email_logs) as total_email_logs;

-- Ver manifestações por status
SELECT status, COUNT(*) as total
FROM manifestacoes
GROUP BY status;

-- Ver manifestações por tipo
SELECT categoria_tipo, COUNT(*) as total
FROM manifestacoes
GROUP BY categoria_tipo
ORDER BY total DESC;
```

---

## Cenários de Teste

### 1. Registro de Manifestação

#### Teste 1.1: Manifestação Anônima (Texto)

```
Tipo: Texto
Categoria: Reclamação
Órgão: SES-DF (Saúde)
Anônimo: Sim
Conteúdo: "Reclamação sobre demora no atendimento..."
```

**Resultado esperado**: ✅ Protocolo gerado, senha gerada

#### Teste 1.2: Manifestação Identificada (Áudio)

```
Tipo: Áudio
Categoria: Sugestão
Órgão: SEMOB (Transporte)
Anônimo: Não
Nome: João Silva
Email: joao.teste@example.com
Áudio: Grave um áudio de teste
```

**Resultado esperado**: ✅ Protocolo gerado, email enviado

#### Teste 1.3: Manifestação com Imagem

```
Tipo: Imagem
Categoria: Denúncia
Órgão: SEMA-DF (Meio Ambiente)
Anônimo: Sim
Imagem: Foto de lixo/desmatamento
```

**Resultado esperado**: ✅ Upload da imagem, protocolo gerado

#### Teste 1.4: Manifestação com Vídeo

```
Tipo: Vídeo
Categoria: Elogio
Órgão: SSP-DF (Segurança)
Anônimo: Não
Nome: Maria Costa
Email: maria.teste@example.com
Vídeo: Vídeo curto (máx 50MB)
```

**Resultado esperado**: ✅ Upload do vídeo, protocolo + email

### 2. Acompanhamento de Manifestação

#### Teste 2.1: Consulta por Protocolo

```
Protocolo: GDF-2026-XXXXXX (use um dos protocolos seed)
Senha: (senha gerada)
```

**Resultado esperado**: ✅ Detalhes da manifestação exibidos

#### Teste 2.2: Consulta por CPF

```
CPF: 123.456.789-00 (use CPF válido se cadastrado)
```

**Resultado esperado**: ✅ Lista de manifestações do usuário

### 3. Autenticação

#### Teste 3.1: Cadastro

```
Nome: Teste Usuário
Email: teste.novo@example.com
CPF: 123.456.789-00
Senha: Teste@123456
```

**Resultado esperado**: ✅ Conta criada, email de confirmação

#### Teste 3.2: Login

```
Email: teste.novo@example.com
Senha: Teste@123456
```

**Resultado esperado**: ✅ Login bem-sucedido, redirecionado

#### Teste 3.3: Recuperação de Senha

```
Email: teste.novo@example.com
```

**Resultado esperado**: ✅ Email de recuperação enviado

### 4. PWA e Offline

#### Teste 4.1: Instalação PWA

1. Abra a aplicação no Chrome/Edge
2. Clique no ícone de instalação (barra de endereço)
3. Confirme instalação

**Resultado esperado**: ✅ App instalado, ícone no desktop

#### Teste 4.2: Funcionamento Offline

1. Abra a aplicação instalada
2. Desative a internet
3. Tente registrar uma manifestação

**Resultado esperado**: ✅ Salvo na fila, sync ao reconectar

### 5. Acessibilidade

#### Teste 5.1: Navegação por Teclado

1. Use apenas Tab/Shift+Tab para navegar
2. Enter para ativar botões
3. Esc para fechar modais

**Resultado esperado**: ✅ Navegação completa sem mouse

#### Teste 5.2: Leitor de Tela

1. Ative NVDA (Windows) ou VoiceOver (Mac)
2. Navegue pela aplicação

**Resultado esperado**: ✅ Todos os elementos anunciados

#### Teste 5.3: VLibras

1. Clique no botão VLibras (canto inferior direito)
2. Navegue pela aplicação

**Resultado esperado**: ✅ Tradução em LIBRAS funcionando

#### Teste 5.4: Contraste e Tamanho de Fonte

1. Use a barra de acessibilidade
2. Aumente o tamanho da fonte (+)
3. Ative alto contraste

**Resultado esperado**: ✅ Texto legível, contraste adequado

---

## Contas de Teste

### Usuários com Manifestações (Seed Data)

| Email | Nome | Manifestações |
|-------|------|---------------|
| maria.santos@example.com | Maria Silva Santos | 1 (Saúde) |
| joao.oliveira@example.com | João Carlos Oliveira | 1 (Transporte) |
| ana.costa@example.com | Ana Beatriz Costa | 1 (Segurança) |
| carlos.dias@example.com | Carlos Roberto Dias | 1 (Energia) |
| pedro.alves@example.com | Pedro Henrique Alves | 1 (Obras) |
| fernanda.lima@example.com | Fernanda Rodrigues Lima | 1 (Transporte) |
| lucas.souza@example.com | Lucas Ferreira Souza | 1 (Documentação) |

**Nota**: Estes usuários precisam ser criados no Supabase Auth para login.

### Criar Usuários de Teste

#### Via Supabase Dashboard

1. Vá em **Authentication > Users**
2. Clique em **Add User**
3. Email: `maria.santos@example.com`
4. Senha: `Teste@123456`
5. Auto Confirm User: ✅
6. Repetir para outros emails

#### Via Supabase CLI

```bash
# Criar usuário
supabase auth signup maria.santos@example.com Teste@123456
```

#### Via SQL (Avançado)

```sql
-- Inserir usuário diretamente (use com cuidado)
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'maria.santos@example.com',
  crypt('Teste@123456', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW()
);
```

---

## Testes Automatizados

### Executar Testes Unitários

```bash
cd ouvidoria-gdf-main
npm test
```

**Resultado esperado**: 46/46 testes passando

### Executar Build

```bash
npm run build
```

**Resultado esperado**: ✅ Build bem-sucedido, sem erros

### Verificar Linting

```bash
npm run lint
```

**Resultado esperado**: ✅ Sem erros de lint

### Executar Prettier

```bash
npm run format
```

**Resultado esperado**: ✅ Código formatado

---

## Métricas e Estatísticas

### Query de Estatísticas

```sql
-- Dashboard completo
SELECT
  -- Total de manifestações
  COUNT(*) as total_manifestacoes,

  -- Por status
  COUNT(*) FILTER (WHERE status = 'aguardando_resposta') as aguardando_resposta,
  COUNT(*) FILTER (WHERE status = 'em_analise') as em_analise,
  COUNT(*) FILTER (WHERE status = 'respondida') as respondidas,

  -- Por tipo
  COUNT(*) FILTER (WHERE categoria_tipo = 'reclamacao') as reclamacoes,
  COUNT(*) FILTER (WHERE categoria_tipo = 'denuncia') as denuncias,
  COUNT(*) FILTER (WHERE categoria_tipo = 'sugestao') as sugestoes,
  COUNT(*) FILTER (WHERE categoria_tipo = 'elogio') as elogios,

  -- Por anonimato
  COUNT(*) FILTER (WHERE anonimo = true) as anonimas,
  COUNT(*) FILTER (WHERE anonimo = false) as identificadas,

  -- Tempo médio de resposta (dias)
  AVG(
    EXTRACT(EPOCH FROM (respondida_em - created_at)) / 86400
  ) FILTER (WHERE respondida_em IS NOT NULL) as tempo_medio_resposta_dias

FROM manifestacoes;
```

### Ver Emails Enviados

```sql
SELECT
  DATE(sent_at) as dia,
  COUNT(*) as total_enviados,
  COUNT(*) FILTER (WHERE status = 'success') as sucesso,
  COUNT(*) FILTER (WHERE status = 'failed') as falhas,
  ROUND(
    COUNT(*) FILTER (WHERE status = 'success')::numeric / COUNT(*) * 100,
    2
  ) as taxa_sucesso_pct
FROM email_logs
GROUP BY DATE(sent_at)
ORDER BY dia DESC;
```

---

## Checklist de Testes

Antes de considerar a aplicação pronta:

- [ ] Todos os tipos de manifestação funcionam (texto, áudio, imagem, vídeo)
- [ ] Manifestações anônimas e identificadas funcionam
- [ ] Email de protocolo é enviado corretamente
- [ ] Consulta de manifestação funciona (protocolo + senha)
- [ ] Consulta por CPF funciona
- [ ] Cadastro e login funcionam
- [ ] PWA pode ser instalado
- [ ] Funciona offline e sincroniza ao reconectar
- [ ] Navegação por teclado funciona
- [ ] Leitor de tela anuncia corretamente
- [ ] VLibras funciona
- [ ] Controles de acessibilidade funcionam
- [ ] Testes automatizados passam (46/46)
- [ ] Build gera sem erros
- [ ] Sem erros de lint/prettier

---

## Suporte

Para dúvidas sobre testes:
- Email: dev@df.gov.br
- Documentação: [README.md](README.md)
- Issues: GitHub Issues

---

**Boa sorte nos testes! 🧪**

*Última atualização: 30/01/2026*
