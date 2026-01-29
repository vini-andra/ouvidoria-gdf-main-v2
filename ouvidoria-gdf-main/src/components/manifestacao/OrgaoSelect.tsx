import { useState, useEffect, useMemo } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building2, Search, Check, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Orgao {
  id: string;
  nome: string;
  sigla: string;
  tipo: string;
}

interface OrgaoSelectProps {
  value: string | null;
  onChange: (orgaoId: string | null) => void;
  error?: string;
}

export function OrgaoSelect({ value, onChange, error }: OrgaoSelectProps) {
  const [orgaos, setOrgaos] = useState<Orgao[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function fetchOrgaos() {
      const { data, error } = await supabase
        .from("orgaos")
        .select("id, nome, sigla, tipo")
        .eq("ativo", true)
        .order("nome");

      if (!error && data) {
        setOrgaos(data);
      }
      setLoading(false);
    }
    fetchOrgaos();
  }, []);

  const filteredOrgaos = useMemo(() => {
    if (!search.trim()) return orgaos;
    const term = search.toLowerCase();
    return orgaos.filter(
      (o) =>
        o.nome.toLowerCase().includes(term) ||
        o.sigla.toLowerCase().includes(term)
    );
  }, [orgaos, search]);

  const selectedOrgao = orgaos.find((o) => o.id === value);

  const groupedOrgaos = useMemo(() => {
    const groups: Record<string, Orgao[]> = {
      secretaria: [],
      autarquia: [],
      unidade: [],
      administracao: [],
    };
    filteredOrgaos.forEach((o) => {
      if (groups[o.tipo]) {
        groups[o.tipo].push(o);
      }
    });
    return groups;
  }, [filteredOrgaos]);

  const tipoLabels: Record<string, string> = {
    secretaria: "Secretarias",
    autarquia: "Autarquias",
    unidade: "Unidades",
    administracao: "Administrações Regionais",
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="orgao-select" className="text-base font-medium">
        Órgão responsável
      </Label>
      <p id="orgao-help" className="text-sm text-muted-foreground">
        Selecione o órgão relacionado à sua manifestação (opcional)
      </p>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="orgao-select"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-describedby="orgao-help"
            aria-invalid={!!error}
            className={`w-full justify-between min-h-[44px] ${
              !selectedOrgao ? "text-muted-foreground" : ""
            }`}
          >
            <span className="flex items-center gap-2 truncate">
              <Building2 className="h-4 w-4 shrink-0" aria-hidden="true" />
              {selectedOrgao
                ? `${selectedOrgao.sigla} - ${selectedOrgao.nome}`
                : "Selecione um órgão..."}
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 z-50" align="start">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                placeholder="Buscar órgão..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                aria-label="Buscar órgão"
              />
            </div>
          </div>
          
          <ScrollArea className="h-[300px]">
            {loading ? (
              <div className="p-4 text-center text-muted-foreground">
                Carregando órgãos...
              </div>
            ) : filteredOrgaos.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                Nenhum órgão encontrado
              </div>
            ) : (
              <div className="p-1">
                {value && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground mb-1"
                    onClick={() => {
                      onChange(null);
                      setOpen(false);
                    }}
                  >
                    Limpar seleção
                  </Button>
                )}
                
                {Object.entries(groupedOrgaos).map(([tipo, items]) => {
                  if (items.length === 0) return null;
                  return (
                    <div key={tipo} className="mb-2">
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {tipoLabels[tipo] || tipo}
                      </div>
                      {items.map((orgao) => (
                        <Button
                          key={orgao.id}
                          variant="ghost"
                          className={`w-full justify-start gap-2 h-auto py-2 px-2 ${
                            value === orgao.id ? "bg-accent" : ""
                          }`}
                          onClick={() => {
                            onChange(orgao.id);
                            setOpen(false);
                            setSearch("");
                          }}
                        >
                          {value === orgao.id && (
                            <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                          )}
                          <span className={`flex-1 text-left ${value !== orgao.id ? "pl-6" : ""}`}>
                            <span className="font-medium">{orgao.sigla}</span>
                            <span className="text-muted-foreground"> - {orgao.nome}</span>
                          </span>
                        </Button>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
