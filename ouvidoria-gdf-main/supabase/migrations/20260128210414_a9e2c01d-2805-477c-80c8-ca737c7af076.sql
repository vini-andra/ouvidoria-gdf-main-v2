-- Etapa 2: Reformulação do Fluxo - Órgãos, Tipos e Campos Estendidos

-- Enum para tipo de órgão
CREATE TYPE public.tipo_orgao AS ENUM ('secretaria', 'administracao', 'unidade', 'autarquia');

-- Enum para categoria de manifestação (tipos do Wireflow)
CREATE TYPE public.categoria_manifestacao AS ENUM ('reclamacao', 'denuncia', 'sugestao', 'elogio', 'solicitacao', 'informacao');

-- Tabela de Órgãos do GDF
CREATE TABLE public.orgaos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  sigla VARCHAR(20) NOT NULL,
  tipo tipo_orgao NOT NULL DEFAULT 'secretaria',
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS para órgãos (leitura pública, escrita apenas admin)
ALTER TABLE public.orgaos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Órgãos são visíveis publicamente"
ON public.orgaos
FOR SELECT
USING (ativo = true);

CREATE POLICY "Admins podem gerenciar órgãos"
ON public.orgaos
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Adicionar novos campos na tabela manifestacoes
ALTER TABLE public.manifestacoes
ADD COLUMN IF NOT EXISTS categoria_tipo categoria_manifestacao,
ADD COLUMN IF NOT EXISTS orgao_id UUID REFERENCES public.orgaos(id),
ADD COLUMN IF NOT EXISTS local_ocorrencia TEXT,
ADD COLUMN IF NOT EXISTS data_ocorrencia DATE,
ADD COLUMN IF NOT EXISTS envolvidos TEXT,
ADD COLUMN IF NOT EXISTS testemunhas TEXT,
ADD COLUMN IF NOT EXISTS sigilo_dados BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_manifestacoes_user_id ON public.manifestacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_manifestacoes_orgao_id ON public.manifestacoes(orgao_id);
CREATE INDEX IF NOT EXISTS idx_manifestacoes_categoria_tipo ON public.manifestacoes(categoria_tipo);
CREATE INDEX IF NOT EXISTS idx_orgaos_sigla ON public.orgaos(sigla);

-- Seed de órgãos principais do GDF
INSERT INTO public.orgaos (nome, sigla, tipo) VALUES
('Secretaria de Estado de Saúde', 'SES', 'secretaria'),
('Secretaria de Estado de Educação', 'SEE', 'secretaria'),
('Secretaria de Estado de Segurança Pública', 'SSP', 'secretaria'),
('Secretaria de Estado de Transporte e Mobilidade', 'SEMOB', 'secretaria'),
('Secretaria de Estado de Obras e Infraestrutura', 'SODF', 'secretaria'),
('Secretaria de Estado de Desenvolvimento Social', 'SEDES', 'secretaria'),
('Secretaria de Estado de Economia', 'SEEC', 'secretaria'),
('Secretaria de Estado de Cultura e Economia Criativa', 'SECEC', 'secretaria'),
('Secretaria de Estado de Justiça e Cidadania', 'SEJUS', 'secretaria'),
('Secretaria de Estado do Meio Ambiente e Proteção Animal', 'SEMA', 'secretaria'),
('Companhia de Saneamento Ambiental do DF', 'CAESB', 'autarquia'),
('Companhia Energética de Brasília', 'CEB', 'autarquia'),
('Companhia Urbanizadora da Nova Capital', 'NOVACAP', 'autarquia'),
('Departamento de Trânsito do DF', 'DETRAN-DF', 'autarquia'),
('Corpo de Bombeiros Militar do DF', 'CBMDF', 'unidade'),
('Polícia Militar do DF', 'PMDF', 'unidade'),
('Polícia Civil do DF', 'PCDF', 'unidade'),
('Administração Regional de Brasília', 'RA-I', 'administracao'),
('Administração Regional de Taguatinga', 'RA-III', 'administracao'),
('Administração Regional de Ceilândia', 'RA-IX', 'administracao'),
('Administração Regional de Samambaia', 'RA-XII', 'administracao'),
('Administração Regional do Plano Piloto', 'RA-I', 'administracao')
ON CONFLICT DO NOTHING;

-- Atualizar RLS de manifestacoes para usuários autenticados verem suas próprias
CREATE POLICY "Usuários podem ver suas próprias manifestações"
ON public.manifestacoes
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Usuários podem atualizar suas próprias manifestações"
ON public.manifestacoes
FOR UPDATE
USING (user_id = auth.uid());