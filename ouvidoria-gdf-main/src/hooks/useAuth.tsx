import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  nome_completo: string;
  cpf: string;
  data_nascimento: string;
  sexo: "masculino" | "feminino" | "outro";
  telefone: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    profileData: Omit<Profile, "id">
  ) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  completeProfile: (profileData: Omit<Profile, "id">) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async (userId: string) => {
    console.log("[fetchProfile] Fetching profile for userId:", userId);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    console.log("[fetchProfile] Response:", { data, error: error ? JSON.stringify(error) : null });

    if (error) {
      console.error("Error fetching profile:", JSON.stringify(error, null, 2));
      return null;
    }
    return data as Profile | null;
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      // Defer profile fetch with setTimeout to prevent deadlock
      if (session?.user) {
        setTimeout(() => {
          fetchProfile(session.user.id).then(setProfile);
        }, 0);
      } else {
        setProfile(null);
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchProfile(session.user.id).then((p) => {
          setProfile(p);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    profileData: Omit<Profile, "id">
  ): Promise<{ error: Error | null }> => {
    try {
      const redirectUrl = `${window.location.origin}/`;

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (authError) {
        if (authError.message.includes("already registered")) {
          return { error: new Error("Este e-mail já está cadastrado. Tente fazer login.") };
        }
        return { error: authError };
      }

      if (!data.user) {
        return { error: new Error("Erro ao criar usuário.") };
      }

      // Verificar se a sessão está disponível
      if (data.session) {
        // Sessão disponível - criar perfil diretamente
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          nome_completo: profileData.nome_completo,
          cpf: profileData.cpf,
          data_nascimento: profileData.data_nascimento,
          sexo: profileData.sexo,
          telefone: profileData.telefone,
        });

        if (profileError) {
          if (profileError.message.includes("duplicate")) {
            if (profileError.message.includes("cpf")) {
              return { error: new Error("Este CPF já está cadastrado.") };
            }
          }
          console.error("Profile creation error:", profileError);
          return { error: new Error("Erro ao criar perfil. Tente novamente.") };
        }
      } else {
        // Sessão não disponível (confirmação por email habilitada)
        // Armazenar dados do perfil no localStorage para completar depois
        localStorage.setItem(
          "pendingProfile",
          JSON.stringify({
            oderId: data.user.id,
            ...profileData,
          })
        );
      }

      return { error: null };
    } catch (err) {
      console.error("SignUp error:", err);
      return { error: err as Error };
    }
  };

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          return { error: new Error("E-mail ou senha incorretos.") };
        }
        return { error };
      }

      return { error: null };
    } catch (err) {
      console.error("SignIn error:", err);
      return { error: err as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    toast({
      title: "Você saiu",
      description: "Sua sessão foi encerrada com sucesso.",
    });
  };

  const refreshProfile = async () => {
    if (user) {
      const p = await fetchProfile(user.id);
      setProfile(p);
    }
  };

  const completeProfile = async (
    profileData: Omit<Profile, "id">
  ): Promise<{ error: Error | null }> => {
    try {
      if (!user) {
        return { error: new Error("Usuário não autenticado.") };
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        nome_completo: profileData.nome_completo,
        cpf: profileData.cpf,
        data_nascimento: profileData.data_nascimento,
        sexo: profileData.sexo,
        telefone: profileData.telefone,
      });

      if (profileError) {
        if (profileError.message.includes("duplicate")) {
          if (profileError.message.includes("cpf")) {
            return { error: new Error("Este CPF já está cadastrado.") };
          }
        }
        console.error("Profile creation error:", profileError);
        return { error: new Error("Erro ao criar perfil. Tente novamente.") };
      }

      // Refresh the profile after creation
      await refreshProfile();

      toast({
        title: "Perfil criado!",
        description: "Seu perfil foi criado com sucesso.",
      });

      return { error: null };
    } catch (err) {
      console.error("Complete profile error:", err);
      return { error: err as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        refreshProfile,
        completeProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
