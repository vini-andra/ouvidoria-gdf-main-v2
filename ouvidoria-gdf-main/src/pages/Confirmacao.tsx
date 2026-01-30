import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, ArrowLeft, Mail, Loader2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import QRCodeDisplay from "@/components/confirmacao/QRCodeDisplay";
import ProtocoloCard from "@/components/confirmacao/ProtocoloCard";
import CompartilharButtons from "@/components/confirmacao/CompartilharButtons";

interface LocationState {
  protocolo?: string;
  senha?: string;
  email?: string | null;
}

const Confirmacao = () => {
  const location = useLocation();
  const state = location.state as LocationState | null;
  const protocolo = state?.protocolo || "OUV-20260129-000001";
  const senha = state?.senha || "ABC123";
  const submittedEmail = state?.email;

  const { toast } = useToast();
  const [email, setEmail] = useState(submittedEmail || "");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleEnviarEmail = async () => {
    if (!email) {
      toast({
        title: "E-mail obrigatório",
        description: "Por favor, informe um e-mail válido.",
        variant: "destructive",
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, informe um e-mail válido.",
        variant: "destructive",
      });
      return;
    }

    setIsSendingEmail(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-protocol-email", {
        body: { email, protocolo, senha },
      });

      if (error) {
        throw error;
      }

      if (data?.success) {
        setEmailSent(true);
        toast({
          title: "E-mail enviado!",
          description: `Protocolo e senha enviados para ${email}`,
        });
      } else {
        toast({
          title: "Aviso",
          description: data?.message || "Não foi possível enviar o e-mail.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar o e-mail. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8 md:py-12">
        <div className="max-w-lg mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center"
                aria-hidden="true"
              >
                <CheckCircle className="w-12 h-12 text-success" />
              </div>
              <CardTitle className="text-2xl text-success">Manifestação Registrada!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Protocolo e Senha */}
              <ProtocoloCard protocolo={protocolo} senha={senha} />

              {/* QR Code */}
              <QRCodeDisplay protocolo={protocolo} senha={senha} />

              {/* Botões de compartilhamento */}
              <CompartilharButtons protocolo={protocolo} senha={senha} />

              <p className="text-sm text-muted-foreground">
                Guarde o protocolo e a senha para acompanhar sua manifestação.
              </p>

              {/* Email Section */}
              <div className="border-t pt-6 space-y-4">
                <p className="text-sm font-medium">Deseja receber o protocolo por e-mail?</p>

                {emailSent ? (
                  <div className="bg-success/10 text-success p-4 rounded-lg flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>E-mail enviado com sucesso!</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-left">
                      <Label htmlFor="email" className="sr-only">
                        E-mail
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSendingEmail}
                        aria-describedby="email-hint"
                      />
                      <p id="email-hint" className="text-xs text-muted-foreground mt-1 text-left">
                        Enviaremos o protocolo e a senha para este e-mail.
                      </p>
                    </div>
                    <Button
                      onClick={handleEnviarEmail}
                      disabled={isSendingEmail || !email}
                      className="w-full"
                    >
                      {isSendingEmail ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
                          Enviar por E-mail
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-3 pt-4 border-t">
                <Button asChild className="w-full">
                  <Link to={`/consulta?protocolo=${encodeURIComponent(protocolo)}`}>
                    <Search className="w-4 h-4 mr-2" aria-hidden="true" />
                    Acompanhar Manifestação
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full">
                  <Link to="/">
                    <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                    Voltar ao Início
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Confirmacao;
