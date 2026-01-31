/**
 * IZA Service - Serviço de Inteligência Artificial da Ouvidoria
 *
 * Este serviço simula o processamento de IA para análise de manifestações.
 * A estrutura está preparada para integração real futura via API.
 *
 * @author Equipe Participa DF
 * @version 2.0.0
 */

// ============================================================================
// TIPOS E INTERFACES
// ============================================================================

export interface IzaAnaliseResultado {
    tipo: string;
    tipoLabel: string;
    assunto: string;
    categoria: string;
    categoriaLabel: string;
    confianca: number;
    alertaDiscrepancia: boolean;
    mensagemDiscrepancia?: string;
}

interface TipoManifestacao {
    id: string;
    label: string;
    keywords: string[];
    peso: number;
}

interface AssuntoCategoria {
    categoria: string;
    categoriaLabel: string;
    assuntos: {
        id: string;
        label: string;
        keywords: string[];
    }[];
}

// ============================================================================
// DADOS DE TREINAMENTO (SIMULAÇÃO)
// ============================================================================

const TIPOS_MANIFESTACAO: TipoManifestacao[] = [
    {
        id: "denuncia",
        label: "Denúncia",
        keywords: [
            "denuncio",
            "denúncia",
            "irregularidade",
            "ilegal",
            "corrupção",
            "fraude",
            "desvio",
            "abuso",
            "má conduta",
            "improbidade",
            "propina",
            "suborno",
            "favorecimento",
            "nepotismo",
            "assédio",
            "violação",
            "crime",
            "criminoso",
            "ilícito",
        ],
        peso: 1.2,
    },
    {
        id: "reclamacao",
        label: "Reclamação",
        keywords: [
            "reclamo",
            "reclamação",
            "insatisfeito",
            "problema",
            "péssimo",
            "ruim",
            "horrível",
            "demora",
            "lentidão",
            "atraso",
            "falta",
            "não funciona",
            "quebrado",
            "abandonado",
            "descaso",
            "negligência",
            "ineficiência",
            "má qualidade",
            "precário",
        ],
        peso: 1.0,
    },
    {
        id: "elogio",
        label: "Elogio",
        keywords: [
            "elogio",
            "parabenizo",
            "parabéns",
            "excelente",
            "ótimo",
            "maravilhoso",
            "eficiente",
            "atencioso",
            "competente",
            "agradeço",
            "agradecimento",
            "satisfeito",
            "bom atendimento",
            "rápido",
            "prestativo",
            "dedicado",
            "profissional",
        ],
        peso: 1.1,
    },
    {
        id: "sugestao",
        label: "Sugestão",
        keywords: [
            "sugiro",
            "sugestão",
            "proposta",
            "ideia",
            "melhoria",
            "poderia",
            "deveria",
            "seria bom",
            "recomendo",
            "implementar",
            "criar",
            "desenvolver",
            "aprimorar",
            "modernizar",
            "inovar",
        ],
        peso: 1.0,
    },
    {
        id: "solicitacao",
        label: "Solicitação",
        keywords: [
            "solicito",
            "solicitação",
            "requeiro",
            "requerimento",
            "preciso",
            "necessito",
            "peço",
            "pedido",
            "demanda",
            "providência",
            "informação",
            "esclarecimento",
            "documento",
            "certidão",
        ],
        peso: 1.0,
    },
];

const ASSUNTOS_POR_CATEGORIA: AssuntoCategoria[] = [
    {
        categoria: "saude",
        categoriaLabel: "Saúde",
        assuntos: [
            {
                id: "falta_medicamentos",
                label: "Falta de Medicamentos",
                keywords: ["medicamento", "remédio", "remedio", "falta", "farmácia", "farmacia"],
            },
            {
                id: "demora_atendimento",
                label: "Demora no Atendimento",
                keywords: ["demora", "espera", "fila", "aguardando", "horas", "atendimento"],
            },
            {
                id: "falta_medicos",
                label: "Falta de Médicos",
                keywords: ["médico", "medico", "doutor", "especialista", "consulta", "falta"],
            },
            {
                id: "infraestrutura_hospitalar",
                label: "Infraestrutura Hospitalar",
                keywords: ["hospital", "upa", "posto", "leito", "maca", "equipamento"],
            },
            {
                id: "vacinacao",
                label: "Vacinação",
                keywords: ["vacina", "vacinação", "imunização", "dose", "campanha"],
            },
        ],
    },
    {
        categoria: "mobilidade",
        categoriaLabel: "Mobilidade",
        assuntos: [
            {
                id: "atraso_onibus",
                label: "Atraso de Ônibus",
                keywords: ["ônibus", "onibus", "atraso", "demora", "horário", "horario"],
            },
            {
                id: "lotacao_transporte",
                label: "Lotação do Transporte",
                keywords: ["lotado", "cheio", "superlotação", "apertado", "passageiros"],
            },
            {
                id: "metro_problemas",
                label: "Problemas no Metrô",
                keywords: ["metrô", "metro", "estação", "parada", "falha"],
            },
            {
                id: "sinalizacao_transito",
                label: "Sinalização de Trânsito",
                keywords: ["semáforo", "semaforo", "placa", "sinalização", "trânsito"],
            },
            {
                id: "acessibilidade_transporte",
                label: "Acessibilidade no Transporte",
                keywords: ["rampa", "elevador", "cadeirante", "deficiente", "acessível"],
            },
        ],
    },
    {
        categoria: "educacao",
        categoriaLabel: "Educação",
        assuntos: [
            {
                id: "falta_vagas",
                label: "Falta de Vagas",
                keywords: ["vaga", "matrícula", "matricula", "escola", "creche"],
            },
            {
                id: "infraestrutura_escolar",
                label: "Infraestrutura Escolar",
                keywords: ["escola", "sala", "carteira", "banheiro", "quadra"],
            },
            {
                id: "merenda_escolar",
                label: "Merenda Escolar",
                keywords: ["merenda", "alimentação", "lanche", "comida", "refeição"],
            },
            {
                id: "transporte_escolar",
                label: "Transporte Escolar",
                keywords: ["transporte", "ônibus", "escolar", "aluno", "estudante"],
            },
            {
                id: "qualidade_ensino",
                label: "Qualidade do Ensino",
                keywords: ["professor", "aula", "ensino", "aprendizado", "didática"],
            },
        ],
    },
    {
        categoria: "seguranca",
        categoriaLabel: "Segurança",
        assuntos: [
            {
                id: "policiamento",
                label: "Falta de Policiamento",
                keywords: ["polícia", "policia", "viatura", "ronda", "patrulha"],
            },
            {
                id: "violencia_urbana",
                label: "Violência Urbana",
                keywords: ["assalto", "roubo", "furto", "violência", "crime"],
            },
            {
                id: "iluminacao_publica",
                label: "Iluminação Pública",
                keywords: ["iluminação", "poste", "luz", "escuro", "lâmpada"],
            },
            {
                id: "drogas",
                label: "Tráfico de Drogas",
                keywords: ["droga", "tráfico", "usuário", "ponto de venda"],
            },
            {
                id: "atendimento_delegacia",
                label: "Atendimento em Delegacia",
                keywords: ["delegacia", "boletim", "ocorrência", "registro"],
            },
        ],
    },
    {
        categoria: "infraestrutura",
        categoriaLabel: "Infraestrutura",
        assuntos: [
            {
                id: "buraco_via",
                label: "Buraco na Via",
                keywords: ["buraco", "cratera", "asfalto", "rua", "avenida"],
            },
            {
                id: "calcada_danificada",
                label: "Calçada Danificada",
                keywords: ["calçada", "calcada", "passeio", "piso", "irregular"],
            },
            {
                id: "esgoto_aberto",
                label: "Esgoto a Céu Aberto",
                keywords: ["esgoto", "fossa", "saneamento", "cheiro", "mau odor"],
            },
            {
                id: "falta_agua",
                label: "Falta de Água",
                keywords: ["água", "agua", "falta", "abastecimento", "torneira"],
            },
            {
                id: "lixo_acumulado",
                label: "Lixo Acumulado",
                keywords: ["lixo", "entulho", "coleta", "sujeira", "descarte"],
            },
            {
                id: "poda_arvores",
                label: "Poda de Árvores",
                keywords: ["árvore", "arvore", "galho", "poda", "queda"],
            },
        ],
    },
];

// ============================================================================
// FUNÇÕES DE ANÁLISE
// ============================================================================

function normalizarTexto(texto: string): string {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function calcularMatchScore(texto: string, keywords: string[]): number {
    const textoNormalizado = normalizarTexto(texto);
    let score = 0;

    for (const keyword of keywords) {
        const keywordNormalizada = normalizarTexto(keyword);
        if (textoNormalizado.includes(keywordNormalizada)) {
            // Peso maior para palavras mais longas (mais específicas)
            score += 1 + keyword.length * 0.1;
        }
    }

    return score;
}

function identificarTipo(texto: string): { tipo: string; tipoLabel: string; score: number } {
    let melhorTipo = TIPOS_MANIFESTACAO[1]; // reclamacao como padrão
    let melhorScore = 0;

    for (const tipo of TIPOS_MANIFESTACAO) {
        const score = calcularMatchScore(texto, tipo.keywords) * tipo.peso;
        if (score > melhorScore) {
            melhorScore = score;
            melhorTipo = tipo;
        }
    }

    return {
        tipo: melhorTipo.id,
        tipoLabel: melhorTipo.label,
        score: melhorScore,
    };
}

function identificarAssunto(
    texto: string
): { assunto: string; categoria: string; categoriaLabel: string; score: number } | null {
    let melhorMatch: {
        assunto: string;
        categoria: string;
        categoriaLabel: string;
        score: number;
    } | null = null;

    for (const cat of ASSUNTOS_POR_CATEGORIA) {
        for (const assunto of cat.assuntos) {
            const score = calcularMatchScore(texto, assunto.keywords);
            if (score > 0 && (!melhorMatch || score > melhorMatch.score)) {
                melhorMatch = {
                    assunto: assunto.label,
                    categoria: cat.categoria,
                    categoriaLabel: cat.categoriaLabel,
                    score,
                };
            }
        }
    }

    return melhorMatch;
}

function detectarDiscrepancia(
    texto: string,
    tipoIdentificado: string,
    tipoSelecionado?: string
): { alertaDiscrepancia: boolean; mensagem?: string } {
    if (!tipoSelecionado) {
        return { alertaDiscrepancia: false };
    }

    // Verificar se o tipo selecionado difere significativamente do identificado
    const tipoSelecionadoNorm = tipoSelecionado.toLowerCase();

    // Casos de discrepância grave
    if (tipoSelecionadoNorm === "elogio" && tipoIdentificado === "denuncia") {
        return {
            alertaDiscrepancia: true,
            mensagem:
                "O texto parece conter uma denúncia, mas você selecionou 'Elogio'. Deseja revisar a classificação?",
        };
    }

    if (tipoSelecionadoNorm === "elogio" && tipoIdentificado === "reclamacao") {
        return {
            alertaDiscrepancia: true,
            mensagem:
                "O texto parece conter uma reclamação, mas você selecionou 'Elogio'. Deseja revisar a classificação?",
        };
    }

    if (tipoSelecionadoNorm === "denuncia" && tipoIdentificado === "elogio") {
        return {
            alertaDiscrepancia: true,
            mensagem:
                "O texto parece ser um elogio, mas você selecionou 'Denúncia'. Deseja revisar a classificação?",
        };
    }

    return { alertaDiscrepancia: false };
}

function calcularConfianca(tipoScore: number, assuntoScore: number): number {
    // Normaliza os scores para um valor entre 0 e 1
    const scoreTotal = tipoScore + assuntoScore;
    const confianca = Math.min(0.95, 0.5 + scoreTotal * 0.05);
    return Math.round(confianca * 100) / 100;
}

// ============================================================================
// FUNÇÃO PRINCIPAL DE ANÁLISE
// ============================================================================

/**
 * Analisa uma manifestação usando a IZA (IA da Ouvidoria).
 *
 * Esta função simula o processamento de IA com um delay de 1.5s.
 * A estrutura está preparada para integração real futura.
 *
 * @param texto - O texto da manifestação a ser analisado
 * @param tipoSelecionado - O tipo manualmente selecionado pelo usuário (opcional)
 * @returns Promise com o resultado da análise
 *
 * @example
 * // Uso atual (simulação)
 * const resultado = await analisarManifestacao("Falta medicamento no hospital");
 *
 * @example
 * // INTEGRAÇÃO FUTURA COM API REAL
 * // Substitua o conteúdo desta função por:
 * //
 * // export async function analisarManifestacao(
 * //   texto: string,
 * //   tipoSelecionado?: string
 * // ): Promise<IzaAnaliseResultado> {
 * //   const response = await fetch('/api/iza/analisar', {
 * //     method: 'POST',
 * //     headers: { 'Content-Type': 'application/json' },
 * //     body: JSON.stringify({ texto, tipoSelecionado }),
 * //   });
 * //
 * //   if (!response.ok) {
 * //     throw new Error('Erro ao analisar manifestação');
 * //   }
 * //
 * //   return response.json();
 * // }
 */
export async function analisarManifestacao(
    texto: string,
    tipoSelecionado?: string
): Promise<IzaAnaliseResultado | null> {
    // Validação mínima
    if (!texto || texto.trim().length < 15) {
        return null;
    }

    // Simula delay de processamento da IA (1.5 segundos)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Identificar tipo de manifestação
    const tipoResult = identificarTipo(texto);

    // Identificar assunto/categoria
    const assuntoResult = identificarAssunto(texto);

    // Se não encontrou nada relevante
    if (!assuntoResult && tipoResult.score === 0) {
        return null;
    }

    // Detectar discrepância
    const discrepancia = detectarDiscrepancia(texto, tipoResult.tipo, tipoSelecionado);

    // Calcular confiança
    const confianca = calcularConfianca(tipoResult.score, assuntoResult?.score || 0);

    return {
        tipo: tipoResult.tipo,
        tipoLabel: tipoResult.tipoLabel,
        assunto: assuntoResult?.assunto || "Assunto Geral",
        categoria: assuntoResult?.categoria || "outros",
        categoriaLabel: assuntoResult?.categoriaLabel || "Outros",
        confianca,
        alertaDiscrepancia: discrepancia.alertaDiscrepancia,
        mensagemDiscrepancia: discrepancia.mensagem,
    };
}

// ============================================================================
// FUNÇÕES UTILITÁRIAS EXPORTADAS
// ============================================================================

/**
 * Retorna lista de categorias disponíveis para seleção manual
 */
export function getCategorias(): { id: string; label: string }[] {
    return ASSUNTOS_POR_CATEGORIA.map((cat) => ({
        id: cat.categoria,
        label: cat.categoriaLabel,
    }));
}

/**
 * Retorna lista de tipos de manifestação disponíveis
 */
export function getTiposManifestacao(): { id: string; label: string }[] {
    return TIPOS_MANIFESTACAO.map((tipo) => ({
        id: tipo.id,
        label: tipo.label,
    }));
}
