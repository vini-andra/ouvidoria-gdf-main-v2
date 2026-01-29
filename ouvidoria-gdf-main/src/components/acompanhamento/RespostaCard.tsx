import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, User, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface RespostaCardProps {
  conteudo: string;
  autor?: string | null;
  createdAt: string;
}

export function RespostaCard({ conteudo, autor, createdAt }: RespostaCardProps) {
  const dataFormatada = format(new Date(createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

  return (
    <Card className="border-l-4 border-l-secondary bg-secondary/5">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="h-5 w-5 text-secondary" aria-hidden="true" />
          Resposta Oficial
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {conteudo}
        </p>
        
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
          {autor && (
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" aria-hidden="true" />
              {autor}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            {dataFormatada}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
