-- Etapa 3: Dashboard e Acompanhamento - Histórico e Respostas

-- Enum para status de manifestação
CREATE TYPE public.status_manifestacao AS ENUM (
  'registrado', 
  'em_analise', 
  'encaminhado', 
  'respondido', 
  'concluido', 
  'arquivado'
);

-- Enum para tipo de resposta
CREATE TYPE public.tipo_resposta AS ENUM ('oficial', 'interna');

-- Tabela de Histórico de Manifestações
CREATE TABLE public.manifestacao_historico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manifestacao_id UUID NOT NULL REFERENCES public.manifestacoes(id) ON DELETE CASCADE,
  status status_manifestacao NOT NULL,
  descricao TEXT,
  orgao_responsavel VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de Respostas de Manifestações
CREATE TABLE public.manifestacao_respostas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manifestacao_id UUID NOT NULL REFERENCES public.manifestacoes(id) ON DELETE CASCADE,
  tipo tipo_resposta NOT NULL DEFAULT 'oficial',
  conteudo TEXT NOT NULL,
  autor VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Adicionar coluna de status atual na manifestação para facilitar consultas
ALTER TABLE public.manifestacoes
ADD COLUMN IF NOT EXISTS status status_manifestacao NOT NULL DEFAULT 'registrado';

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_historico_manifestacao_id ON public.manifestacao_historico(manifestacao_id);
CREATE INDEX IF NOT EXISTS idx_historico_created_at ON public.manifestacao_historico(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_respostas_manifestacao_id ON public.manifestacao_respostas(manifestacao_id);
CREATE INDEX IF NOT EXISTS idx_manifestacoes_status ON public.manifestacoes(status);

-- RLS para manifestacao_historico
ALTER TABLE public.manifestacao_historico ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver histórico de suas manifestações
CREATE POLICY "Usuários podem ver histórico de suas manifestações"
ON public.manifestacao_historico
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.manifestacoes m
    WHERE m.id = manifestacao_id 
    AND (m.user_id = auth.uid() OR m.anonimo = false)
  )
);

-- Consulta pública por manifestação (para consulta por protocolo)
CREATE POLICY "Consulta pública de histórico"
ON public.manifestacao_historico
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.manifestacoes m
    WHERE m.id = manifestacao_id
  )
);

-- Admins podem gerenciar histórico
CREATE POLICY "Admins podem gerenciar histórico"
ON public.manifestacao_historico
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- RLS para manifestacao_respostas
ALTER TABLE public.manifestacao_respostas ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver respostas oficiais de suas manifestações
CREATE POLICY "Usuários podem ver respostas de suas manifestações"
ON public.manifestacao_respostas
FOR SELECT
USING (
  tipo = 'oficial' AND
  EXISTS (
    SELECT 1 FROM public.manifestacoes m
    WHERE m.id = manifestacao_id 
    AND (m.user_id = auth.uid() OR m.anonimo = false)
  )
);

-- Consulta pública por protocolo
CREATE POLICY "Consulta pública de respostas oficiais"
ON public.manifestacao_respostas
FOR SELECT
USING (
  tipo = 'oficial' AND
  EXISTS (
    SELECT 1 FROM public.manifestacoes m
    WHERE m.id = manifestacao_id
  )
);

-- Admins podem gerenciar respostas
CREATE POLICY "Admins podem gerenciar respostas"
ON public.manifestacao_respostas
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Trigger para criar histórico inicial quando manifestação é criada
CREATE OR REPLACE FUNCTION public.create_initial_historico()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.manifestacao_historico (manifestacao_id, status, descricao)
  VALUES (NEW.id, 'registrado', 'Manifestação registrada no sistema');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_manifestacao_created
  AFTER INSERT ON public.manifestacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.create_initial_historico();

-- Trigger para atualizar status da manifestação quando novo histórico é adicionado
CREATE OR REPLACE FUNCTION public.update_manifestacao_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.manifestacoes
  SET status = NEW.status, updated_at = now()
  WHERE id = NEW.manifestacao_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_historico_created
  AFTER INSERT ON public.manifestacao_historico
  FOR EACH ROW
  EXECUTE FUNCTION public.update_manifestacao_status();