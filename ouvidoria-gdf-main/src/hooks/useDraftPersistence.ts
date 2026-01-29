import { useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";
import type { CategoriaManifestacao } from "@/components/manifestacao/TipoManifestacaoSelect";
import type { Database } from "@/integrations/supabase/types";

type TipoManifestacao = Database["public"]["Enums"]["tipo_manifestacao"];

// Interface for serializable draft data (no Blobs or Files)
interface DraftData {
  tipo: TipoManifestacao;
  conteudo: string;
  selectedCategories: string[];
  isAnonymous: boolean;
  nome: string;
  email: string;
  categoriaTipo: CategoriaManifestacao | null;
  orgaoId: string | null;
  localOcorrencia: string;
  dataOcorrencia: string | null; // ISO string
  envolvidos: string;
  testemunhas: string;
  sigiloDados: boolean;
  savedAt: number; // Timestamp
}

const DRAFT_STORAGE_KEY = "manifestacao-draft";
const DRAFT_EXPIRY_HOURS = 24;

export function useDraftPersistence() {
  // Save draft to localStorage
  const saveDraft = useCallback((formState: {
    tipo: TipoManifestacao;
    conteudo: string;
    selectedCategories: string[];
    isAnonymous: boolean;
    nome: string;
    email: string;
    categoriaTipo: CategoriaManifestacao | null;
    orgaoId: string | null;
    localOcorrencia: string;
    dataOcorrencia: Date | null;
    envolvidos: string;
    testemunhas: string;
    sigiloDados: boolean;
  }) => {
    try {
      const draftData: DraftData = {
        tipo: formState.tipo,
        conteudo: formState.conteudo,
        selectedCategories: formState.selectedCategories,
        isAnonymous: formState.isAnonymous,
        nome: formState.nome,
        email: formState.email,
        categoriaTipo: formState.categoriaTipo,
        orgaoId: formState.orgaoId,
        localOcorrencia: formState.localOcorrencia,
        dataOcorrencia: formState.dataOcorrencia?.toISOString() || null,
        envolvidos: formState.envolvidos,
        testemunhas: formState.testemunhas,
        sigiloDados: formState.sigiloDados,
        savedAt: Date.now(),
      };

      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
      
      toast({
        title: "Rascunho salvo",
        description: "Seu progresso foi salvo localmente.",
      });
    } catch (error) {
      console.error("Error saving draft:", error);
      toast({
        title: "Erro ao salvar rascunho",
        description: "Não foi possível salvar seu progresso.",
        variant: "destructive",
      });
    }
  }, []);

  // Load draft from localStorage
  const loadDraft = useCallback((): Partial<{
    tipo: TipoManifestacao;
    conteudo: string;
    selectedCategories: string[];
    isAnonymous: boolean;
    nome: string;
    email: string;
    categoriaTipo: CategoriaManifestacao | null;
    orgaoId: string | null;
    localOcorrencia: string;
    dataOcorrencia: Date | null;
    envolvidos: string;
    testemunhas: string;
    sigiloDados: boolean;
  }> | null => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!savedDraft) return null;

      const draftData: DraftData = JSON.parse(savedDraft);
      
      // Check if draft has expired
      const expiryTime = DRAFT_EXPIRY_HOURS * 60 * 60 * 1000;
      if (Date.now() - draftData.savedAt > expiryTime) {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        return null;
      }

      return {
        tipo: draftData.tipo,
        conteudo: draftData.conteudo,
        selectedCategories: draftData.selectedCategories,
        isAnonymous: draftData.isAnonymous,
        nome: draftData.nome,
        email: draftData.email,
        categoriaTipo: draftData.categoriaTipo,
        orgaoId: draftData.orgaoId,
        localOcorrencia: draftData.localOcorrencia,
        dataOcorrencia: draftData.dataOcorrencia ? new Date(draftData.dataOcorrencia) : null,
        envolvidos: draftData.envolvidos,
        testemunhas: draftData.testemunhas,
        sigiloDados: draftData.sigiloDados,
      };
    } catch (error) {
      console.error("Error loading draft:", error);
      return null;
    }
  }, []);

  // Clear draft from localStorage
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing draft:", error);
    }
  }, []);

  // Check if draft exists
  const hasDraft = useCallback((): boolean => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!savedDraft) return false;

      const draftData: DraftData = JSON.parse(savedDraft);
      const expiryTime = DRAFT_EXPIRY_HOURS * 60 * 60 * 1000;
      
      if (Date.now() - draftData.savedAt > expiryTime) {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }, []);

  return {
    saveDraft,
    loadDraft,
    clearDraft,
    hasDraft,
  };
}
