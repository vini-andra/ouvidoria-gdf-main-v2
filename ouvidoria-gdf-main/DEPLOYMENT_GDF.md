# Guia de Deployment - Ambiente GDF

Este documento descreve os passos para deploy da aplicação Ouvidoria Digital no ambiente do Governo do Distrito Federal.

## Índice

1. [Pré-requisitos](#pré-requisitos)
2. [Configuração do Supabase](#configuração-do-supabase)
3. [Configuração de Email](#configuração-de-email)
4. [Deploy da Aplicação](#deploy-da-aplicação)
5. [Configuração de Domínio](#configuração-de-domínio)
6. [Testes em Produção](#testes-em-produção)
7. [Monitoramento](#monitoramento)

---

## Pré-requisitos

### Ferramentas Necessárias

- **Node.js** 18+ e npm
- **Git** para controle de versão
- **Supabase CLI** (`npm install -g supabase`)
- Conta no **Supabase** (criar em [supabase.com](https://supabase.com))
- Conta no **Resend** para envio de emails (criar em [resend.com](https://resend.com))

### Acessos Necessários

- ☐ Acesso ao servidor DNS do GDF
- ☐ Conta Supabase com permissões de admin
- ☐ Conta Resend com domínio verificado
- ☐ Credenciais de deploy (GitHub/Vercel/Netlify)

---

## Configuração do Supabase

### 1. Criar Projeto

1. Acesse [app.supabase.com](https://app.supabase.com)
2. Clique em "New Project"
3. Preencha:
   - **Name**: Ouvidoria Digital GDF
   - **Database Password**: Gere uma senha forte
   - **Region**: South America (São Paulo)
4. Aguarde ~2 minutos para criação

### 2. Executar Migrações

```bash
# Clone o repositório
git clone https://github.com/gdf/ouvidoria-digital.git
cd ouvidoria-digital/ouvidoria-gdf-main

# Login no Supabase
supabase login

# Link ao projeto
supabase link --project-ref XXXXXXXXXXXX

# Executar migrações
supabase db push

# Verificar
supabase db diff
```

### 3. Configurar RLS (Row Level Security)

As políticas RLS já estão nas migrações, mas verifique:

```sql
-- Verificar políticas ativas
SELECT schemaname, tablename, policyname, permissive, roles
FROM pg_policies
WHERE schemaname = 'public';
```

### 4. Obter Credenciais

No painel Supabase, vá em **Settings > API**:

```bash
# Copie estes valores para o arquivo .env
VITE_SUPABASE_URL=https://XXXXXXXXXXXX.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Configuração de Email

### 1. Configurar Domínio no Resend

1. Acesse [resend.com/domains](https://resend.com/domains)
2. Adicione: `ouvidoria.df.gov.br` ou `df.gov.br`
3. Configure os registros DNS:

```dns
# SPF Record
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

# DKIM Records (fornecidos pelo Resend)
Type: TXT
Name: resend._domainkey
Value: [valor fornecido pelo Resend]

# DMARC Record
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@df.gov.br
```

4. Aguarde verificação (~24h)

### 2. Configurar Edge Function

```bash
# Obter API Key do Resend
# Dashboard > API Keys > Create API Key

# Configurar secrets no Supabase
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxx
supabase secrets set EMAIL_FROM="Ouvidoria GDF <ouvidoria@df.gov.br>"
supabase secrets set APP_BASE_URL=https://ouvidoria.df.gov.br

# Deploy da Edge Function
cd supabase/functions
supabase functions deploy send-protocol-email

# Testar
supabase functions invoke send-protocol-email \
  --body '{"email":"teste@df.gov.br","protocolo":"GDF-2026-001234"}'
```

---

## Deploy da Aplicação

### Opção 1: GitHub Pages (Recomendado para MVP)

```bash
# 1. Configure GitHub Pages
# No repositório GitHub: Settings > Pages
# Source: GitHub Actions

# 2. Crie workflow (já existe em .github/workflows/deploy.yml)

# 3. Push para main
git add .
git commit -m "feat: Prepare for GDF production"
git push origin main

# 4. Aplicação estará em:
# https://gdf.github.io/ouvidoria-digital/
```

### Opção 2: Vercel (Recomendado para Produção)

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deploy
cd ouvidoria-gdf-main
vercel

# 3. Configurar variáveis de ambiente
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_APP_BASE_URL

# 4. Deploy produção
vercel --prod
```

### Opção 3: Netlify

```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
cd ouvidoria-gdf-main
netlify deploy --prod

# 4. Configurar variáveis
# Site Settings > Build & Deploy > Environment
```

---

## Configuração de Domínio

### DNS Records para ouvidoria.df.gov.br

```dns
# A Record (Vercel/Netlify)
Type: A
Name: ouvidoria
Value: 76.76.21.21 (IP do provider)

# CNAME (alternativa)
Type: CNAME
Name: ouvidoria
Value: cname.vercel-dns.com

# SSL/TLS
# Configurar SSL automático no provider
```

### Configurar no Provider

**Vercel**:
1. Settings > Domains
2. Add: `ouvidoria.df.gov.br`
3. Configurar DNS conforme instruções

**Netlify**:
1. Domain Settings > Custom Domains
2. Add: `ouvidoria.df.gov.br`
3. Configurar DNS conforme instruções

---

## Testes em Produção

### Checklist de Testes

- [ ] **Registro de Manifestação**
  - [ ] Texto
  - [ ] Áudio
  - [ ] Imagem
  - [ ] Vídeo
  - [ ] Anônima
  - [ ] Identificada

- [ ] **Email**
  - [ ] Recebimento de protocolo
  - [ ] Link de acompanhamento funciona
  - [ ] Não vai para spam

- [ ] **Acompanhamento**
  - [ ] Consulta por protocolo
  - [ ] Consulta por CPF
  - [ ] Visualização de status

- [ ] **Autenticação**
  - [ ] Cadastro
  - [ ] Login
  - [ ] Logout
  - [ ] Recuperação de senha

- [ ] **PWA**
  - [ ] Instalável
  - [ ] Funciona offline
  - [ ] Sincronização ao voltar online

- [ ] **Acessibilidade**
  - [ ] Leitor de tela
  - [ ] Navegação por teclado
  - [ ] Contraste adequado
  - [ ] VLibras funcionando

### Script de Teste Automatizado

```bash
# Executar testes E2E (se implementados)
npm run test:e2e

# Testar Edge Function
curl -X POST https://XXXXXXXXXXXX.supabase.co/functions/v1/send-protocol-email \
  -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@df.gov.br","protocolo":"GDF-2026-001234"}'
```

---

## Monitoramento

### 1. Logs de Aplicação

**Vercel**:
```bash
vercel logs ouvidoria-digital
```

**Netlify**:
```bash
netlify logs
```

### 2. Logs do Supabase

```bash
# Logs da Edge Function
supabase functions logs send-protocol-email --tail

# Logs do banco
# Acessar via Dashboard > Database > Logs
```

### 3. Métricas de Email

```sql
-- Dashboard de emails
SELECT
  DATE(sent_at) as dia,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'success') as sucesso,
  COUNT(*) FILTER (WHERE status = 'failed') as falhas,
  ROUND(
    COUNT(*) FILTER (WHERE status = 'success')::numeric / COUNT(*) * 100,
    2
  ) as taxa_sucesso
FROM email_logs
WHERE sent_at >= NOW() - INTERVAL '7 days'
GROUP BY DATE(sent_at)
ORDER BY dia DESC;
```

### 4. Analytics (Opcional)

Configure Google Analytics ou Plausible:

```env
# .env
VITE_ANALYTICS_ID=G-XXXXXXXXXX
```

---

## Backup e Recuperação

### Backup do Banco de Dados

```bash
# Backup manual
supabase db dump -f backup_$(date +%Y%m%d).sql

# Backup automático (já configurado no Supabase)
# Project Settings > Database > Backups
# Configurar: Daily backups, retenção de 7 dias
```

### Restauração

```bash
# Restaurar de backup
supabase db reset --db-url "postgresql://..."
psql -h db.xxxxxxxxxxxx.supabase.co -U postgres < backup_20260130.sql
```

---

## Segurança

### Checklist de Segurança

- [x] HTTPS habilitado
- [x] RLS configurado no Supabase
- [x] CORS restrito
- [x] Rate limiting na Edge Function
- [x] Variáveis de ambiente seguras
- [ ] CAPTCHA (se necessário)
- [ ] WAF configurado (Cloudflare/Vercel)
- [x] Sanitização de inputs

### Variáveis de Ambiente Sensíveis

**NUNCA commitar**:
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- Senhas de banco de dados

**Armazenar em**:
- Supabase Secrets (Edge Functions)
- Vercel/Netlify Environment Variables
- 1Password/Vault (backup)

---

## Suporte e Manutenção

### Contatos

- **Equipe de Desenvolvimento**: dev@df.gov.br
- **Suporte Técnico**: suporte@df.gov.br
- **Emergências**: (61) 1234-5678

### Atualização da Aplicação

```bash
# 1. Pull da branch main
git pull origin main

# 2. Instalar dependências
npm install

# 3. Testar localmente
npm run dev
npm run build
npm test

# 4. Deploy
git push origin main
# ou
vercel --prod
```

### Rotinas de Manutenção

**Diária**:
- Verificar logs de erro
- Monitorar taxa de sucesso de emails

**Semanal**:
- Revisar manifestações pendentes
- Verificar estatísticas de uso

**Mensal**:
- Backup manual do banco
- Revisar políticas RLS
- Atualizar dependências

---

## Troubleshooting

### Email não está sendo enviado

**Verificar**:
1. `RESEND_API_KEY` configurada?
2. Domínio verificado no Resend?
3. Logs da Edge Function: `supabase functions logs send-protocol-email`

### Erro ao salvar manifestação

**Verificar**:
1. RLS configurado corretamente?
2. Bucket de storage criado? (`manifestacoes-arquivos`)
3. Logs do Supabase

### PWA não instala

**Verificar**:
1. HTTPS habilitado?
2. `manifest.webmanifest` acessível?
3. Service Worker registrado?

---

## Checklist Final

Antes de considerar o deploy concluído:

- [ ] Todas as migrações executadas
- [ ] Emails sendo enviados e recebidos
- [ ] Domínio configurado e SSL ativo
- [ ] Testes em produção passando
- [ ] Monitoramento configurado
- [ ] Backup automático ativo
- [ ] Documentação atualizada
- [ ] Equipe treinada
- [ ] Suporte preparado

---

**Boa sorte com o deploy! 🚀**

*Última atualização: 30/01/2026*
