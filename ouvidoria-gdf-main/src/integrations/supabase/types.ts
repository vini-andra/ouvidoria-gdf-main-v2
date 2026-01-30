export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1";
  };
  public: {
    Tables: {
      manifestacao_historico: {
        Row: {
          created_at: string;
          descricao: string | null;
          id: string;
          manifestacao_id: string;
          orgao_responsavel: string | null;
          status: Database["public"]["Enums"]["status_manifestacao"];
        };
        Insert: {
          created_at?: string;
          descricao?: string | null;
          id?: string;
          manifestacao_id: string;
          orgao_responsavel?: string | null;
          status: Database["public"]["Enums"]["status_manifestacao"];
        };
        Update: {
          created_at?: string;
          descricao?: string | null;
          id?: string;
          manifestacao_id?: string;
          orgao_responsavel?: string | null;
          status?: Database["public"]["Enums"]["status_manifestacao"];
        };
        Relationships: [
          {
            foreignKeyName: "manifestacao_historico_manifestacao_id_fkey";
            columns: ["manifestacao_id"];
            isOneToOne: false;
            referencedRelation: "manifestacoes";
            referencedColumns: ["id"];
          },
        ];
      };
      manifestacao_respostas: {
        Row: {
          autor: string | null;
          conteudo: string;
          created_at: string;
          id: string;
          manifestacao_id: string;
          tipo: Database["public"]["Enums"]["tipo_resposta"];
        };
        Insert: {
          autor?: string | null;
          conteudo: string;
          created_at?: string;
          id?: string;
          manifestacao_id: string;
          tipo?: Database["public"]["Enums"]["tipo_resposta"];
        };
        Update: {
          autor?: string | null;
          conteudo?: string;
          created_at?: string;
          id?: string;
          manifestacao_id?: string;
          tipo?: Database["public"]["Enums"]["tipo_resposta"];
        };
        Relationships: [
          {
            foreignKeyName: "manifestacao_respostas_manifestacao_id_fkey";
            columns: ["manifestacao_id"];
            isOneToOne: false;
            referencedRelation: "manifestacoes";
            referencedColumns: ["id"];
          },
        ];
      };
      manifestacoes: {
        Row: {
          anonimo: boolean;
          arquivo_url: string | null;
          categoria: string | null;
          categoria_tipo: Database["public"]["Enums"]["categoria_manifestacao"] | null;
          conteudo: string | null;
          created_at: string;
          data_ocorrencia: string | null;
          email: string | null;
          envolvidos: string | null;
          id: string;
          local_ocorrencia: string | null;
          nome: string | null;
          orgao_id: string | null;
          protocolo: string;
          senha_acompanhamento: string | null;
          sigilo_dados: boolean;
          status: Database["public"]["Enums"]["status_manifestacao"];
          testemunhas: string | null;
          tipo: Database["public"]["Enums"]["tipo_manifestacao"];
          updated_at: string;
          user_id: string | null;
        };
        Insert: {
          anonimo?: boolean;
          arquivo_url?: string | null;
          categoria?: string | null;
          categoria_tipo?: Database["public"]["Enums"]["categoria_manifestacao"] | null;
          conteudo?: string | null;
          created_at?: string;
          data_ocorrencia?: string | null;
          email?: string | null;
          envolvidos?: string | null;
          id?: string;
          local_ocorrencia?: string | null;
          nome?: string | null;
          orgao_id?: string | null;
          protocolo: string;
          senha_acompanhamento?: string | null;
          sigilo_dados?: boolean;
          status?: Database["public"]["Enums"]["status_manifestacao"];
          testemunhas?: string | null;
          tipo: Database["public"]["Enums"]["tipo_manifestacao"];
          updated_at?: string;
          user_id?: string | null;
        };
        Update: {
          anonimo?: boolean;
          arquivo_url?: string | null;
          categoria?: string | null;
          categoria_tipo?: Database["public"]["Enums"]["categoria_manifestacao"] | null;
          conteudo?: string | null;
          created_at?: string;
          data_ocorrencia?: string | null;
          email?: string | null;
          envolvidos?: string | null;
          id?: string;
          local_ocorrencia?: string | null;
          nome?: string | null;
          orgao_id?: string | null;
          protocolo?: string;
          senha_acompanhamento?: string | null;
          sigilo_dados?: boolean;
          status?: Database["public"]["Enums"]["status_manifestacao"];
          testemunhas?: string | null;
          tipo?: Database["public"]["Enums"]["tipo_manifestacao"];
          updated_at?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "manifestacoes_orgao_id_fkey";
            columns: ["orgao_id"];
            isOneToOne: false;
            referencedRelation: "orgaos";
            referencedColumns: ["id"];
          },
        ];
      };
      orgaos: {
        Row: {
          ativo: boolean;
          created_at: string;
          id: string;
          nome: string;
          sigla: string;
          tipo: Database["public"]["Enums"]["tipo_orgao"];
        };
        Insert: {
          ativo?: boolean;
          created_at?: string;
          id?: string;
          nome: string;
          sigla: string;
          tipo?: Database["public"]["Enums"]["tipo_orgao"];
        };
        Update: {
          ativo?: boolean;
          created_at?: string;
          id?: string;
          nome?: string;
          sigla?: string;
          tipo?: Database["public"]["Enums"]["tipo_orgao"];
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          cpf: string;
          created_at: string;
          data_nascimento: string;
          id: string;
          nome_completo: string;
          sexo: Database["public"]["Enums"]["sexo_tipo"];
          telefone: string | null;
          updated_at: string;
        };
        Insert: {
          cpf: string;
          created_at?: string;
          data_nascimento: string;
          id: string;
          nome_completo: string;
          sexo: Database["public"]["Enums"]["sexo_tipo"];
          telefone?: string | null;
          updated_at?: string;
        };
        Update: {
          cpf?: string;
          created_at?: string;
          data_nascimento?: string;
          id?: string;
          nome_completo?: string;
          sexo?: Database["public"]["Enums"]["sexo_tipo"];
          telefone?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: "admin" | "user";
      categoria_manifestacao:
        | "reclamacao"
        | "denuncia"
        | "sugestao"
        | "elogio"
        | "solicitacao"
        | "informacao";
      sexo_tipo: "masculino" | "feminino" | "outro";
      status_manifestacao:
        | "registrado"
        | "em_analise"
        | "encaminhado"
        | "respondido"
        | "concluido"
        | "arquivado";
      tipo_manifestacao: "texto" | "audio" | "imagem" | "video";
      tipo_orgao: "secretaria" | "administracao" | "unidade" | "autarquia";
      tipo_resposta: "oficial" | "interna";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      categoria_manifestacao: [
        "reclamacao",
        "denuncia",
        "sugestao",
        "elogio",
        "solicitacao",
        "informacao",
      ],
      sexo_tipo: ["masculino", "feminino", "outro"],
      status_manifestacao: [
        "registrado",
        "em_analise",
        "encaminhado",
        "respondido",
        "concluido",
        "arquivado",
      ],
      tipo_manifestacao: ["texto", "audio", "imagem", "video"],
      tipo_orgao: ["secretaria", "administracao", "unidade", "autarquia"],
      tipo_resposta: ["oficial", "interna"],
    },
  },
} as const;
