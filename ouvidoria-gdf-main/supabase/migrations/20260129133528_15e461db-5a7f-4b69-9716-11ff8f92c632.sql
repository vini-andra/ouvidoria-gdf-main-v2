-- Etapa 4: QR Code, Senha de Acompanhamento e Formato de Protocolo Oficial

-- Adicionar campo de senha de acompanhamento na tabela manifestacoes
ALTER TABLE public.manifestacoes
ADD COLUMN IF NOT EXISTS senha_acompanhamento VARCHAR(10);

-- Atualizar a função de geração de protocolo para o formato oficial OUV-YYYYMMDD-XXXXXX
CREATE OR REPLACE FUNCTION public.generate_protocolo()
RETURNS TRIGGER AS $$
DECLARE
  date_part TEXT;
  sequence_num INT;
  new_protocolo TEXT;
  new_senha TEXT;
BEGIN
  -- Formato de data: YYYYMMDD
  date_part := TO_CHAR(now(), 'YYYYMMDD');
  
  -- Contar manifestações do dia atual para sequência
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(protocolo FROM 14 FOR 6) AS INT)
  ), 0) + 1
  INTO sequence_num
  FROM public.manifestacoes
  WHERE protocolo LIKE 'OUV-' || date_part || '-%';
  
  -- Formatar protocolo: OUV-YYYYMMDD-XXXXXX
  new_protocolo := 'OUV-' || date_part || '-' || LPAD(sequence_num::TEXT, 6, '0');
  
  -- Gerar senha aleatória de 6 caracteres alfanuméricos
  new_senha := UPPER(SUBSTR(MD5(RANDOM()::TEXT || now()::TEXT), 1, 6));
  
  NEW.protocolo := new_protocolo;
  NEW.senha_acompanhamento := new_senha;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;