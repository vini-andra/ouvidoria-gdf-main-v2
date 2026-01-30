import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus, EyeOff, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";

const EscolhaIdentificacao = () => {
    return (
        <Layout>
            {/* Header Section */}
            <section className="bg-gradient-to-br from-primary to-primary/90 dark:from-primary/70 dark:to-primary/50 py-16 md:py-20">
                <div className="container text-center">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-accent/20 dark:bg-accent/30 flex items-center justify-center">
                        <UserPlus className="w-8 h-8 text-accent dark:text-accent" aria-hidden="true" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground dark:text-white mb-4">
                        Escolha como deseja se identificar
                    </h1>
                    <p className="text-lg text-primary-foreground/90 dark:text-white/90 max-w-2xl mx-auto">
                        Você pode se identificar para receber acompanhamento por e-mail, ou permanecer anônimo
                        para proteger sua identidade.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12 md:py-16">
                <div className="container max-w-4xl">
                    {/* Botões de escolha */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* Opção: Identificado */}
                        <Card className="border-2 hover:border-accent hover:shadow-lg transition-all duration-200 group">
                            <CardContent className="p-8 space-y-4">
                                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                                    <UserPlus className="w-7 h-7 text-accent" aria-hidden="true" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground">
                                    Quero me identificar
                                </h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Cadastre-se ou faça login para registrar sua manifestação de forma identificada.
                                    Você receberá atualizações por e-mail e poderá acompanhar o andamento.
                                </p>
                                <div className="pt-2">
                                    <Button
                                        asChild
                                        size="lg"
                                        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 font-semibold h-14"
                                    >
                                        <Link
                                            to="/cadastro"
                                            aria-label="Cadastrar-se para fazer manifestação identificada"
                                        >
                                            Continuar
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Opção: Anônimo */}
                        <Card className="border-2 hover:border-primary hover:shadow-lg transition-all duration-200 group">
                            <CardContent className="p-8 space-y-4">
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                    <EyeOff className="w-7 h-7 text-primary" aria-hidden="true" />
                                </div>
                                <h2 className="text-2xl font-bold text-foreground">
                                    Quero ficar anônimo
                                </h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Registre sua manifestação sem se identificar. Sua identidade será totalmente
                                    preservada. Você poderá acompanhar apenas pelo número do protocolo.
                                </p>
                                <div className="pt-2">
                                    <Button
                                        asChild
                                        size="lg"
                                        variant="outline"
                                        className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 font-semibold h-14"
                                    >
                                        <Link
                                            to="/manifestacao?modo=anonimo"
                                            aria-label="Fazer manifestação anônima"
                                        >
                                            Continuar
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Informações detalhadas */}
                    <div className="space-y-6">
                        <div className="bg-muted/50 dark:bg-card/50 rounded-lg p-6 border">
                            <h3 className="font-semibold text-xl mb-4 text-foreground flex items-center gap-2">
                                💡 Entenda as diferenças entre as opções
                            </h3>

                            <div className="space-y-6">
                                {/* Manifestação Identificada */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-lg text-accent flex items-center gap-2">
                                        <UserPlus className="w-5 h-5" aria-hidden="true" />
                                        Manifestação Identificada
                                    </h4>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Ao escolher esta opção, você precisará fazer login ou criar uma conta. Seus dados
                                        pessoais (nome e e-mail) ficarão registrados junto com a manifestação.
                                    </p>
                                    <div className="pl-4 border-l-2 border-accent space-y-2">
                                        <p className="text-sm text-muted-foreground">
                                            <strong className="text-foreground">Vantagens:</strong>
                                        </p>
                                        <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
                                            <li>Você receberá atualizações por e-mail sobre sua manifestação</li>
                                            <li>Poderá acompanhar o andamento de forma detalhada em seu painel</li>
                                            <li>A resposta será enviada diretamente para você</li>
                                            <li>Histórico completo de todas as suas manifestações</li>
                                        </ul>
                                        <p className="text-sm text-muted-foreground mt-3">
                                            <strong className="text-foreground">Quando escolher:</strong> Ideal para elogios,
                                            sugestões, solicitações de serviços ou reclamações que precisam de retorno específico.
                                        </p>
                                    </div>
                                </div>

                                {/* Divisor */}
                                <div className="border-t"></div>

                                {/* Manifestação Anônima */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-lg text-primary flex items-center gap-2">
                                        <EyeOff className="w-5 h-5" aria-hidden="true" />
                                        Manifestação Anônima
                                    </h4>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Ao escolher esta opção, você não precisa se identificar. Sua manifestação será
                                        registrada sem nenhum dado pessoal. Sua identidade fica totalmente protegida.
                                    </p>
                                    <div className="pl-4 border-l-2 border-primary space-y-2">
                                        <p className="text-sm text-muted-foreground">
                                            <strong className="text-foreground">Vantagens:</strong>
                                        </p>
                                        <ul className="space-y-1.5 text-sm text-muted-foreground list-disc list-inside">
                                            <li>Total proteção da sua identidade</li>
                                            <li>Não é necessário criar conta ou fazer login</li>
                                            <li>Ideal para situações sensíveis ou delicadas</li>
                                            <li>Registro mais rápido e direto</li>
                                        </ul>
                                        <p className="text-sm text-muted-foreground mt-3">
                                            <strong className="text-foreground">Quando escolher:</strong> Recomendado para
                                            denúncias de irregularidades, situações que envolvem risco pessoal ou quando você
                                            preferir manter sua privacidade totalmente preservada.
                                        </p>
                                        <p className="text-sm text-amber-900 dark:text-amber-400 mt-3 bg-amber-100 dark:bg-amber-950/30 p-3 rounded-md border border-amber-300 dark:border-amber-800">
                                            <strong>⚠️ Importante:</strong> Em manifestações anônimas, você não receberá
                                            respostas por e-mail. O acompanhamento será feito apenas pelo número do protocolo,
                                            que você deve guardar com cuidado.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAQ - Perguntas Frequentes */}
                        <div className="bg-slate-100 dark:bg-primary/10 rounded-lg p-6 border border-slate-300 dark:border-primary/20">
                            <h3 className="font-bold text-xl text-slate-800 dark:text-foreground mb-6 flex items-center gap-2">
                                Perguntas Frequentes (FAQ)
                            </h3>

                            <div className="space-y-5">
                                {/* Pergunta 1 */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-base text-slate-800 dark:text-foreground">
                                        Posso mudar de ideia depois de registrar? ❓
                                    </h4>
                                    <p className="text-sm text-slate-700 dark:text-muted-foreground leading-relaxed">
                                        Não. Após registrar sua manifestação, não é possível alterar entre identificada
                                        e anônima. Por isso, escolha com atenção a opção que melhor atende à sua necessidade.
                                    </p>
                                </div>

                                <div className="border-t border-slate-200 dark:border-primary/20"></div>

                                {/* Pergunta 2 */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-base text-slate-800 dark:text-foreground">
                                        Quanto tempo demora para receber uma resposta? ⏱️
                                    </h4>
                                    <p className="text-sm text-slate-700 dark:text-muted-foreground leading-relaxed">
                                        O prazo legal para resposta é de até 30 dias, podendo ser prorrogado por mais 30 dias
                                        em casos que necessitem de mais investigação. Manifestações identificadas podem
                                        receber respostas mais rapidamente, pois permitem contato direto com você.
                                    </p>
                                </div>

                                <div className="border-t border-slate-200 dark:border-primary/20"></div>

                                {/* Pergunta 3 */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-base text-slate-800 dark:text-foreground">
                                        Meus dados pessoais ficam seguros? 🔒
                                    </h4>
                                    <p className="text-sm text-slate-700 dark:text-muted-foreground leading-relaxed">
                                        Sim. Todos os seus dados são protegidos conforme a Lei Geral de Proteção de Dados (LGPD).
                                        Em manifestações identificadas, apenas servidores autorizados têm acesso às informações.
                                        Em denúncias, sua identidade é tratada com sigilo absoluto.
                                    </p>
                                </div>

                                <div className="border-t border-sky-200 dark:border-primary/20"></div>

                                {/* Pergunta 4 */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-base text-slate-800 dark:text-foreground">
                                        Como faço para acompanhar minha manifestação? 📋
                                    </h4>
                                    <p className="text-sm text-slate-700 dark:text-muted-foreground leading-relaxed">
                                        <strong>Se identificado:</strong> Acesse seu painel pessoal com login e senha.
                                        Você também receberá atualizações por e-mail automaticamente.<br />
                                        <strong>Se anônimo:</strong> Use o número do protocolo fornecido ao final do registro
                                        na página de consulta. Guarde esse número em local seguro.
                                    </p>
                                </div>

                                <div className="border-t border-sky-200 dark:border-primary/20"></div>

                                {/* Pergunta 5 */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-base text-slate-800 dark:text-foreground">
                                        Posso enviar áudio, foto ou vídeo junto com minha manifestação? 📎
                                    </h4>
                                    <p className="text-sm text-slate-700 dark:text-muted-foreground leading-relaxed">
                                        Sim. O sistema permite o envio de diferentes tipos de mídia para complementar
                                        sua manifestação. Você pode digitar um texto, gravar um áudio, anexar uma foto
                                        ou enviar um vídeo curto como forma de relato.
                                    </p>
                                </div>

                                <div className="border-t border-sky-200 dark:border-primary/20"></div>

                                {/* Pergunta 6 */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-base text-slate-800 dark:text-foreground">
                                        Perdi meu número de protocolo. Como recuperar? 🔍
                                    </h4>
                                    <p className="text-sm text-slate-700 dark:text-muted-foreground leading-relaxed">
                                        <strong>Se identificado:</strong> Faça login no sistema e acesse "Meu Painel" para
                                        ver todas as suas manifestações.<br />
                                        <strong>Se anônimo:</strong> Infelizmente não há como recuperar. Por isso é fundamental
                                        guardar o protocolo assim que ele for gerado.
                                    </p>
                                </div>

                                <div className="border-t border-sky-200 dark:border-primary/20"></div>

                                {/* Pergunta 7 */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-base text-slate-800 dark:text-foreground">
                                        Qual a diferença entre denúncia, reclamação e sugestão? 📝
                                    </h4>
                                    <p className="text-sm text-slate-700 dark:text-muted-foreground leading-relaxed">
                                        <strong>Denúncia:</strong> Relato de irregularidades, ilegalidades ou condutas impróprias
                                        praticadas por servidores ou na prestação de serviços públicos.<br />
                                        <strong>Reclamação:</strong> Manifestação de insatisfação com a qualidade de um serviço
                                        público prestado.<br />
                                        <strong>Sugestão:</strong> Proposta para melhoria de serviços, procedimentos ou políticas públicas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Botão voltar */}
                    <div className="mt-8 text-center">
                        <Button
                            asChild
                            variant="ghost"
                            size="lg"
                            className="gap-2 hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <Link to="/" aria-label="Voltar para a página inicial">
                                <ArrowLeft className="w-5 h-5" aria-hidden="true" />
                                Voltar para o início
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default EscolhaIdentificacao;
