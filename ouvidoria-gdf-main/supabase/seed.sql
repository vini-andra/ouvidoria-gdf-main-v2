-- =====================================================
-- SEED DATA FOR OUVIDORIA DIGITAL GDF
-- =====================================================
-- This script populates the database with realistic test data
-- Run with: psql -h localhost -U postgres -d postgres -f seed.sql
-- Or via Supabase Dashboard: SQL Editor > New Query > Paste > Run

-- =====================================================
-- 1. ÓRGÃOS DO GDF (Real Government Bodies)
-- =====================================================

INSERT INTO orgaos (nome, sigla, descricao) VALUES
  ('Secretaria de Estado de Saúde do Distrito Federal', 'SES-DF', 'Responsável pela gestão da saúde pública no DF'),
  ('Secretaria de Estado de Educação do Distrito Federal', 'SEEDF', 'Gestão da educação básica e superior pública'),
  ('Secretaria de Estado de Transporte e Mobilidade', 'SEMOB', 'Transporte público e mobilidade urbana'),
  ('Secretaria de Estado de Segurança Pública', 'SSP-DF', 'Segurança pública e policiamento'),
  ('Companhia Energética de Brasília', 'CEB', 'Distribuição de energia elétrica'),
  ('Companhia de Saneamento Ambiental do Distrito Federal', 'CAESB', 'Saneamento e abastecimento de água'),
  ('Secretaria de Estado de Obras e Infraestrutura', 'SODF', 'Obras públicas e infraestrutura'),
  ('Secretaria de Estado do Meio Ambiente', 'SEMA-DF', 'Meio ambiente e recursos hídricos'),
  ('Secretaria de Estado de Desenvolvimento Social', 'SEDES', 'Assistência social e programas sociais'),
  ('Departamento de Estradas de Rodagem do Distrito Federal', 'DER-DF', 'Conservação de estradas e vias'),
  ('Companhia Urbanizadora da Nova Capital do Brasil', 'NOVACAP', 'Urbanização e obras de infraestrutura'),
  ('Agência Reguladora de Águas, Energia e Saneamento Básico', 'ADASA', 'Regulação de serviços públicos')
ON CONFLICT (sigla) DO NOTHING;

-- =====================================================
-- 2. USUÁRIOS DE TESTE
-- =====================================================
-- Note: Actual user creation requires Supabase Auth API
-- These are placeholder references for manifestations
-- Real user IDs should be obtained from auth.users table

-- Create a comment for reference
COMMENT ON TABLE manifestacoes IS 'Test users can be created via Supabase Auth UI or API. Use these emails for testing: teste1@example.com, teste2@example.com, teste3@example.com';

-- =====================================================
-- 3. MANIFESTAÇÕES DE TESTE (Realistic Examples)
-- =====================================================

-- Get organ IDs for reference
DO $$
DECLARE
  orgao_saude_id UUID;
  orgao_educacao_id UUID;
  orgao_transporte_id UUID;
  orgao_seguranca_id UUID;
  orgao_ceb_id UUID;
  orgao_caesb_id UUID;
  orgao_obras_id UUID;
  orgao_meio_ambiente_id UUID;
BEGIN
  -- Get organ IDs
  SELECT id INTO orgao_saude_id FROM orgaos WHERE sigla = 'SES-DF';
  SELECT id INTO orgao_educacao_id FROM orgaos WHERE sigla = 'SEEDF';
  SELECT id INTO orgao_transporte_id FROM orgaos WHERE sigla = 'SEMOB';
  SELECT id INTO orgao_seguranca_id FROM orgaos WHERE sigla = 'SSP-DF';
  SELECT id INTO orgao_ceb_id FROM orgaos WHERE sigla = 'CEB';
  SELECT id INTO orgao_caesb_id FROM orgaos WHERE sigla = 'CAESB';
  SELECT id INTO orgao_obras_id FROM orgaos WHERE sigla = 'SODF';
  SELECT id INTO orgao_meio_ambiente_id FROM orgaos WHERE sigla = 'SEMA-DF';

  -- Insert test manifestations

  -- 1. Reclamação sobre saúde
  INSERT INTO manifestacoes (
    tipo, conteudo, categoria, categoria_tipo, orgao_id,
    anonimo, nome, email,
    local_ocorrencia, data_ocorrencia,
    status, created_at
  ) VALUES (
    'texto',
    'Gostaria de registrar uma reclamação sobre o atendimento no Hospital Regional de Taguatinga. No dia 25/01/2026, aguardei mais de 6 horas para ser atendida na emergência, mesmo com dores intensas. Os profissionais estavam sobrecarregados e não havia médicos suficientes. Peço providências para melhorar o atendimento e contratar mais profissionais.',
    'saude',
    'reclamacao',
    orgao_saude_id,
    false,
    'Maria Silva Santos',
    'maria.santos@example.com',
    'Hospital Regional de Taguatinga - HRT',
    '2026-01-25',
    'em_analise',
    NOW() - INTERVAL '5 days'
  );

  -- 2. Denúncia sobre educação
  INSERT INTO manifestacoes (
    tipo, conteudo, categoria, categoria_tipo, orgao_id,
    anonimo,
    local_ocorrencia, data_ocorrencia, envolvidos,
    status, created_at
  ) VALUES (
    'texto',
    'Venho denunciar a falta de professores no Centro de Ensino Médio 02 de Ceilândia. Há 3 meses os alunos do 3º ano estão sem professor de Matemática, o que está prejudicando gravemente a preparação para o ENEM. Já foram feitas reclamações na direção, mas nada foi resolvido. A situação é crítica e precisa de solução urgente.',
    'educacao',
    'denuncia',
    orgao_educacao_id,
    true, -- anonymous
    'CEM 02 de Ceilândia',
    '2026-01-15',
    'Diretor da escola, Coordenação Regional de Ensino',
    'aguardando_resposta',
    NOW() - INTERVAL '10 days'
  );

  -- 3. Sugestão sobre transporte
  INSERT INTO manifestacoes (
    tipo, conteudo, categoria, categoria_tipo, orgao_id,
    anonimo, nome, email,
    local_ocorrencia,
    status, created_at
  ) VALUES (
    'texto',
    'Sugiro a criação de uma linha de ônibus direta entre Samambaia e o Setor Comercial Sul, passando pela Av. das Nações. Atualmente, é necessário fazer duas ou três baldeações, o que torna o trajeto muito demorado. Uma linha direta reduziria o tempo de deslocamento de quase 2 horas para cerca de 40 minutos. Isso beneficiaria milhares de trabalhadores da região.',
    'transporte',
    'sugestao',
    orgao_transporte_id,
    false,
    'João Carlos Oliveira',
    'joao.oliveira@example.com',
    'Samambaia - SCS (trajeto proposto)',
    'em_analise',
    NOW() - INTERVAL '3 days'
  );

  -- 4. Elogio sobre atendimento
  INSERT INTO manifestacoes (
    tipo, conteudo, categoria, categoria_tipo, orgao_id,
    anonimo, nome, email,
    local_ocorrencia, envolvidos,
    status, created_at
  ) VALUES (
    'texto',
    'Gostaria de parabenizar a equipe da Delegacia da Criança e do Adolescente pelo excelente atendimento prestado. Precisei registrar uma ocorrência e fui atendida com muito respeito, profissionalismo e empatia pela Delegada Dra. Ana Paula e pela escrivã Fernanda. O ambiente é acolhedor e os profissionais demonstram genuína preocupação com as vítimas. Parabéns pelo trabalho!',
    'seguranca',
    'elogio',
    orgao_seguranca_id,
    false,
    'Ana Beatriz Costa',
    'ana.costa@example.com',
    'DCA - Delegacia da Criança e do Adolescente',
    'Dra. Ana Paula (Delegada), Fernanda (Escrivã)',
    'respondida',
    NOW() - INTERVAL '15 days'
  );

  -- 5. Reclamação sobre CEB (energia)
  INSERT INTO manifestacoes (
    tipo, conteudo, categoria, categoria_tipo, orgao_id,
    anonimo, nome, email,
    local_ocorrencia, data_ocorrencia,
    status, created_at
  ) VALUES (
    'texto',
    'Há uma semana estamos sem energia elétrica na Quadra 10 do Riacho Fundo II. Já foram feitas várias reclamações pelo telefone 116, mas nenhuma equipe foi enviada. Os moradores estão com geladeiras estragadas, perdendo alimentos, e há idosos e crianças sofrendo com o calor. Solicitamos urgência na resolução deste problema.',
    'servicos_publicos',
    'reclamacao',
    orgao_ceb_id,
    false,
    'Carlos Roberto Dias',
    'carlos.dias@example.com',
    'Quadra 10, Riacho Fundo II',
    '2026-01-22',
    'em_analise',
    NOW() - INTERVAL '7 days'
  );

  -- 6. Denúncia sobre CAESB (água)
  INSERT INTO manifestacoes (
    tipo, conteudo, categoria, categoria_tipo, orgao_id,
    anonimo,
    local_ocorrencia, data_ocorrencia,
    status, created_at
  ) VALUES (
    'texto',
    'Denuncio vazamento de água há mais de 15 dias na QNM 36 de Ceilândia, desperdiçando milhares de litros de água potável. A CAESB foi acionada diversas vezes, mas o problema persiste. Em tempos de crise hídrica, é inadmissível tanto desperdício. Solicito providências imediatas.',
    'saneamento',
    'denuncia',
    orgao_caesb_id,
    true, -- anonymous
    'QNM 36, Ceilândia',
    '2026-01-10',
    'aguardando_resposta',
    NOW() - INTERVAL '12 days'
  );

  -- 7. Solicitação sobre obras
  INSERT INTO manifestacoes (
    tipo, conteudo, categoria, categoria_tipo, orgao_id,
    anonimo, nome, email,
    local_ocorrencia,
    status, created_at
  ) VALUES (
    'texto',
    'Solicito a recuperação urgente da pavimentação da Quadra 200 de Santa Maria. As ruas estão completamente esburacadas, causando danos aos veículos e dificultando a mobilidade de pedestres, especialmente idosos e pessoas com deficiência. A última manutenção foi há mais de 5 anos. Peço que a obra seja incluída no planejamento de 2026.',
    'infraestrutura',
    'solicitacao',
    orgao_obras_id,
    false,
    'Pedro Henrique Alves',
    'pedro.alves@example.com',
    'Quadra 200, Santa Maria',
    'em_analise',
    NOW() - INTERVAL '2 days'
  );

  -- 8. Denúncia ambiental
  INSERT INTO manifestacoes (
    tipo, conteudo, categoria, categoria_tipo, orgao_id,
    anonimo,
    local_ocorrencia, data_ocorrencia, envolvidos,
    status, created_at
  ) VALUES (
    'texto',
    'Denuncio desmatamento irregular próximo ao Parque Nacional de Brasília. Árvores nativas estão sendo derrubadas para construção de casas clandestinas. A área é de preservação permanente e a destruição está acontecendo principalmente à noite. Peço fiscalização urgente antes que mais danos sejam causados ao meio ambiente.',
    'meio_ambiente',
    'denuncia',
    orgao_meio_ambiente_id,
    true, -- anonymous for safety
    'Área próxima ao Parque Nacional de Brasília (Setor Noroeste)',
    '2026-01-27',
    'Construção irregular não identificada',
    'em_analise',
    NOW() - INTERVAL '1 day'
  );

  -- 9. Sugestão sobre acessibilidade
  INSERT INTO manifestacoes (
    tipo, conteudo, categoria, categoria_tipo, orgao_id,
    anonimo, nome, email,
    local_ocorrencia,
    status, created_at
  ) VALUES (
    'texto',
    'Sugiro a instalação de rampas de acessibilidade em todas as estações do metrô, principalmente na estação Central (rodoviária). Como cadeirante, enfrento muitas dificuldades para utilizar o transporte público. Algumas estações já possuem elevadores, mas muitas ainda não têm acessibilidade adequada. Isso é um direito garantido por lei e precisa ser priorizado.',
    'acessibilidade',
    'sugestao',
    orgao_transporte_id,
    false,
    'Fernanda Rodrigues Lima',
    'fernanda.lima@example.com',
    'Estação Central do Metrô (Rodoviária)',
    'aguardando_resposta',
    NOW() - INTERVAL '8 days'
  );

  -- 10. Reclamação com resposta
  INSERT INTO manifestacoes (
    tipo, conteudo, categoria, categoria_tipo, orgao_id,
    anonimo, nome, email,
    local_ocorrencia, data_ocorrencia,
    status, resposta, respondida_em, created_at
  ) VALUES (
    'texto',
    'Reclamação sobre a demora na emissão de carteira de identidade. Solicitei há 45 dias e ainda não recebi. O prazo informado era de 30 dias. Preciso do documento urgentemente para viagem.',
    'documentacao',
    'reclamacao',
    (SELECT id FROM orgaos WHERE sigla = 'SSP-DF'),
    false,
    'Lucas Ferreira Souza',
    'lucas.souza@example.com',
    'Instituto de Identificação - Posto de Taguatinga',
    '2025-12-15',
    'respondida',
    'Prezado(a) Lucas, informamos que houve um problema no sistema de impressão que atrasou a emissão de documentos no período solicitado. Sua carteira de identidade foi emitida e está disponível para retirada desde o dia 20/01/2026. Pedimos desculpas pelo transtorno. Para retirar, compareça ao posto com protocolo e documento com foto.',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '20 days'
  );

END $$;

-- =====================================================
-- 4. EMAIL LOGS (Sample audit trail)
-- =====================================================

INSERT INTO email_logs (email, protocolo, status, sent_at) VALUES
  ('maria.santos@example.com', (SELECT protocolo FROM manifestacoes WHERE email = 'maria.santos@example.com' LIMIT 1), 'success', NOW() - INTERVAL '5 days'),
  ('joao.oliveira@example.com', (SELECT protocolo FROM manifestacoes WHERE email = 'joao.oliveira@example.com' LIMIT 1), 'success', NOW() - INTERVAL '3 days'),
  ('ana.costa@example.com', (SELECT protocolo FROM manifestacoes WHERE email = 'ana.costa@example.com' LIMIT 1), 'success', NOW() - INTERVAL '15 days'),
  ('carlos.dias@example.com', (SELECT protocolo FROM manifestacoes WHERE email = 'carlos.dias@example.com' LIMIT 1), 'success', NOW() - INTERVAL '7 days'),
  ('pedro.alves@example.com', (SELECT protocolo FROM manifestacoes WHERE email = 'pedro.alves@example.com' LIMIT 1), 'success', NOW() - INTERVAL '2 days'),
  ('fernanda.lima@example.com', (SELECT protocolo FROM manifestacoes WHERE email = 'fernanda.lima@example.com' LIMIT 1), 'success', NOW() - INTERVAL '8 days'),
  ('lucas.souza@example.com', (SELECT protocolo FROM manifestacoes WHERE email = 'lucas.souza@example.com' LIMIT 1), 'success', NOW() - INTERVAL '20 days');

-- =====================================================
-- 5. STATISTICS VIEW TEST
-- =====================================================

-- View manifestações summary
SELECT
  COUNT(*) as total_manifestacoes,
  COUNT(*) FILTER (WHERE status = 'aguardando_resposta') as aguardando,
  COUNT(*) FILTER (WHERE status = 'em_analise') as em_analise,
  COUNT(*) FILTER (WHERE status = 'respondida') as respondidas,
  COUNT(*) FILTER (WHERE anonimo = true) as anonimas,
  COUNT(*) FILTER (WHERE anonimo = false) as identificadas
FROM manifestacoes;

-- View by category
SELECT
  categoria_tipo,
  COUNT(*) as total
FROM manifestacoes
GROUP BY categoria_tipo
ORDER BY total DESC;

-- View by organ
SELECT
  o.sigla,
  o.nome,
  COUNT(m.id) as total_manifestacoes
FROM orgaos o
LEFT JOIN manifestacoes m ON m.orgao_id = o.id
GROUP BY o.id, o.sigla, o.nome
ORDER BY total_manifestacoes DESC;

-- =====================================================
-- SEED COMPLETED SUCCESSFULLY
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Seed data inserted successfully!';
  RAISE NOTICE '📊 Total organs: %', (SELECT COUNT(*) FROM orgaos);
  RAISE NOTICE '📋 Total manifestations: %', (SELECT COUNT(*) FROM manifestacoes);
  RAISE NOTICE '📧 Total email logs: %', (SELECT COUNT(*) FROM email_logs);
  RAISE NOTICE '';
  RAISE NOTICE '🔐 Test Accounts:';
  RAISE NOTICE '   - maria.santos@example.com';
  RAISE NOTICE '   - joao.oliveira@example.com';
  RAISE NOTICE '   - ana.costa@example.com';
  RAISE NOTICE '';
  RAISE NOTICE '🎯 You can now test the application with realistic data!';
END $$;
