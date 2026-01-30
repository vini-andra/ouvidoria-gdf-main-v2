-- Correção: Aumentar tamanho da coluna protocolo para comportar novo formato
-- Formato: OUV-YYYYMMDD-XXXXXX = 20 caracteres

-- Alterar o tamanho da coluna protocolo de VARCHAR(15) para VARCHAR(25)
ALTER TABLE public.manifestacoes
ALTER COLUMN protocolo TYPE VARCHAR(25);

-- Comentário explicativo
COMMENT ON COLUMN public.manifestacoes.protocolo IS 'Número do protocolo no formato OUV-YYYYMMDD-XXXXXX';
