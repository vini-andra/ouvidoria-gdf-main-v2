-- Enum para tipos de manifestação
CREATE TYPE public.tipo_manifestacao AS ENUM ('texto', 'audio', 'imagem', 'video');

-- Tabela principal de manifestações
CREATE TABLE public.manifestacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocolo VARCHAR(15) UNIQUE NOT NULL,
  tipo tipo_manifestacao NOT NULL,
  conteudo TEXT,
  arquivo_url TEXT,
  categoria VARCHAR(50) DEFAULT 'geral',
  anonimo BOOLEAN NOT NULL DEFAULT true,
  nome VARCHAR(255),
  email VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Função para gerar protocolo no formato YYYY-DF-XXXXX
CREATE OR REPLACE FUNCTION public.generate_protocolo()
RETURNS TRIGGER AS $$
DECLARE
  year_part TEXT;
  sequence_num INT;
  new_protocolo TEXT;
BEGIN
  year_part := EXTRACT(YEAR FROM now())::TEXT;
  
  -- Contar manifestações do ano atual para sequência
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(protocolo FROM 9 FOR 5) AS INT)
  ), 0) + 1
  INTO sequence_num
  FROM public.manifestacoes
  WHERE protocolo LIKE year_part || '-DF-%';
  
  -- Formatar protocolo: YYYY-DF-XXXXX
  new_protocolo := year_part || '-DF-' || LPAD(sequence_num::TEXT, 5, '0');
  
  NEW.protocolo := new_protocolo;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para gerar protocolo automaticamente
CREATE TRIGGER trigger_generate_protocolo
  BEFORE INSERT ON public.manifestacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_protocolo();

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_manifestacoes_updated_at
  BEFORE UPDATE ON public.manifestacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.manifestacoes ENABLE ROW LEVEL SECURITY;

-- Política pública para INSERT (qualquer pessoa pode criar manifestação)
CREATE POLICY "Qualquer pessoa pode criar manifestação"
  ON public.manifestacoes
  FOR INSERT
  WITH CHECK (true);

-- Política para SELECT apenas por protocolo (consulta pública)
CREATE POLICY "Consulta pública por protocolo"
  ON public.manifestacoes
  FOR SELECT
  USING (true);

-- Criar bucket para arquivos de manifestações
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'manifestacoes-arquivos',
  'manifestacoes-arquivos',
  false,
  52428800, -- 50MB
  ARRAY['audio/*', 'image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
);

-- Política para upload público de arquivos
CREATE POLICY "Upload público de arquivos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'manifestacoes-arquivos');

-- Política para leitura de arquivos
CREATE POLICY "Leitura de arquivos de manifestações"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'manifestacoes-arquivos');