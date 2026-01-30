# Edge Function: send-protocol-email

Função Supabase Edge para envio de emails com protocolo de manifestação.

## Funcionalidades

✅ **Produção-Ready**:
- ✓ Validação rigorosa de entrada
- ✓ Rate limiting (5 emails/minuto por IP)
- ✓ Retry com exponential backoff
- ✓ Logging de auditoria no banco
- ✓ Email HTML profissional
- ✓ Link direto de acompanhamento

## Configuração

### Variáveis de Ambiente Obrigatórias

```bash
# Chave da API Resend (OBRIGATÓRIA)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Supabase (já configuradas automaticamente)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Variáveis de Ambiente Opcionais

```bash
# Domínio do remetente (padrão: Ouvidoria DF <noreply@resend.dev>)
EMAIL_FROM=Ouvidoria GDF <ouvidoria@df.gov.br>

# URL base da aplicação (padrão: https://participa-df.gov.br)
APP_BASE_URL=https://ouvidoria.df.gov.br
```

## Setup do Resend

### 1. Criar Conta Resend

1. Acesse [resend.com](https://resend.com)
2. Crie uma conta gratuita (3.000 emails/mês)
3. Verifique seu email

### 2. Adicionar Domínio (Produção)

Para ambiente GDF, configure um domínio próprio:

1. No painel Resend, vá em **Domains**
2. Adicione `df.gov.br` ou subdomínio
3. Configure os registros DNS:
   - SPF: `v=spf1 include:_spf.resend.com ~all`
   - DKIM: (fornecido pelo Resend)
   - DMARC: `v=DMARC1; p=none; rua=mailto:dmarc@df.gov.br`

### 3. Obter API Key

1. Vá em **API Keys**
2. Clique em **Create API Key**
3. Nome: "Ouvidoria DF - Production"
4. Permissões: **Sending access**
5. Copie a chave (começa com `re_`)

### 4. Configurar no Supabase

```bash
# Usando Supabase CLI
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxx
supabase secrets set EMAIL_FROM="Ouvidoria GDF <ouvidoria@df.gov.br>"
supabase secrets set APP_BASE_URL=https://ouvidoria.df.gov.br

# Ou via Dashboard:
# Project Settings > Edge Functions > Manage secrets
```

## Deployment

### Deploy da Função

```bash
# 1. Instalar Supabase CLI
npm install -g supabase

# 2. Login
supabase login

# 3. Link ao projeto
supabase link --project-ref seu-projeto-ref

# 4. Deploy
supabase functions deploy send-protocol-email
```

### Verificar Deploy

```bash
# Testar função
supabase functions invoke send-protocol-email \
  --body '{"email":"teste@df.gov.br","protocolo":"GDF-2026-001234","senha":"ABC123"}'

# Ver logs
supabase functions logs send-protocol-email
```

## Uso

### Request

```typescript
POST https://seu-projeto.supabase.co/functions/v1/send-protocol-email

Headers:
  Content-Type: application/json
  Authorization: Bearer {SUPABASE_ANON_KEY}

Body:
{
  "email": "cidadao@example.com",
  "protocolo": "GDF-2026-001234",
  "senha": "ABC123" // opcional
}
```

### Response (Sucesso)

```json
{
  "success": true,
  "message": "E-mail enviado com sucesso!"
}
```

### Response (Erro)

```json
{
  "success": false,
  "error": "Formato de e-mail inválido"
}
```

## Rate Limiting

- **Limite**: 5 emails por minuto por IP
- **Status**: 429 Too Many Requests
- **Mensagem**: "Muitas requisições. Tente novamente em alguns instantes."

## Monitoramento

### Logs de Email (Auditoria)

A função registra todos os envios na tabela `email_logs`:

```sql
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  protocolo TEXT NOT NULL,
  status TEXT NOT NULL, -- 'success' ou 'failed'
  error_message TEXT,
  sent_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para consulta rápida
CREATE INDEX idx_email_logs_protocolo ON email_logs(protocolo);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at DESC);
```

### Consultar Logs

```sql
-- Ver últimos 10 emails enviados
SELECT * FROM email_logs
ORDER BY sent_at DESC
LIMIT 10;

-- Ver emails com falha
SELECT * FROM email_logs
WHERE status = 'failed'
ORDER BY sent_at DESC;

-- Estatísticas por dia
SELECT
  DATE(sent_at) as dia,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'success') as sucesso,
  COUNT(*) FILTER (WHERE status = 'failed') as falhas
FROM email_logs
GROUP BY DATE(sent_at)
ORDER BY dia DESC;
```

## Segurança

✅ **Implementado**:
- CORS configurado
- Rate limiting por IP
- Validação de entrada
- Sanitização de dados
- Logging de auditoria
- Retry com backoff

⚠️ **Recomendações Adicionais**:
- Configurar SPF/DKIM/DMARC no domínio
- Monitorar taxa de bounce/spam
- Implementar honeypot para formulários públicos
- Adicionar CAPTCHA se houver abuso

## Troubleshooting

### Erro: "RESEND_API_KEY not configured"

**Causa**: Variável de ambiente não configurada
**Solução**: Configure a API key no Supabase:
```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Erro: "Rate limit exceeded"

**Causa**: Mais de 5 emails em 1 minuto do mesmo IP
**Solução**: Aguarde 1 minuto ou implemente fila

### Email não chega

**Causas possíveis**:
1. Email na caixa de spam
2. Domínio sem SPF/DKIM configurado
3. Email inválido

**Verificação**:
```sql
-- Ver status do email específico
SELECT * FROM email_logs
WHERE protocolo = 'GDF-2026-001234';
```

## Custos

### Plano Gratuito Resend
- ✓ 3.000 emails/mês
- ✓ 100 emails/dia
- ✓ Domínios ilimitados

### Plano Pago (se necessário)
- $20/mês: 50.000 emails
- $80/mês: 250.000 emails

### Estimativa GDF
- ~500 manifestações/dia = 500 emails/dia
- ~15.000 emails/mês
- **Custo**: $20/mês (plano pago necessário)

## Contato

Para suporte técnico:
- Email: suporte.ouvidoria@df.gov.br
- Telefone: (61) 1234-5678
