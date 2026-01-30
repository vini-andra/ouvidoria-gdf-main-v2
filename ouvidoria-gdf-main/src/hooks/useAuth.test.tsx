import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "./useAuth";
import { ReactNode } from "react";

// Mock Supabase client
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn((callback) => {
        // Simulate no user on initial load
        callback("INITIAL_SESSION", null);
        return {
          data: {
            subscription: {
              unsubscribe: vi.fn(),
            },
          },
        };
      }),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          maybeSingle: vi.fn(() => Promise.resolve({ data: null, error: null })),
        })),
      })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  },
}));

// Mock useToast
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Hook Usage", () => {
    it("should throw error when used outside AuthProvider", () => {
      // Suppress console.error for this test
      const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow("useAuth must be used within an AuthProvider");

      consoleError.mockRestore();
    });

    it("should not throw error when used inside AuthProvider", () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      expect(() => {
        renderHook(() => useAuth(), { wrapper });
      }).not.toThrow();
    });
  });

  describe("Initialization", () => {
    it("should initialize with null user and session", async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.session).toBeNull();
      expect(result.current.profile).toBeNull();
    });

    it("should have all required methods", async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(typeof result.current.signUp).toBe("function");
      expect(typeof result.current.signIn).toBe("function");
      expect(typeof result.current.signOut).toBe("function");
      expect(typeof result.current.refreshProfile).toBe("function");
    });
  });

  describe("Sign Up", () => {
    it("should handle successful sign up", async () => {
      const { supabase } = await import("@/integrations/supabase/client");

      // Mock successful auth signup
      vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
        data: {
          user: { id: "test-user-id", email: "test@example.com" } as never,
          session: null,
        },
        error: null,
      });

      // Mock successful profile creation
      vi.mocked(supabase.from).mockReturnValueOnce({
        insert: vi.fn(() => Promise.resolve({ data: null, error: null })),
      } as never);

      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signUpResult;
      await act(async () => {
        signUpResult = await result.current.signUp("test@example.com", "password123", {
          nome_completo: "Test User",
          cpf: "12345678900",
          data_nascimento: "1990-01-01",
          sexo: "masculino",
          telefone: "61999999999",
        });
      });

      expect(signUpResult).toEqual({ error: null });
    });

    it("should handle sign up with existing email", async () => {
      const { supabase } = await import("@/integrations/supabase/client");

      vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: "User already registered", name: "AuthError" } as never,
      });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signUpResult;
      await act(async () => {
        signUpResult = await result.current.signUp("existing@example.com", "password123", {
          nome_completo: "Test User",
          cpf: "12345678900",
          data_nascimento: "1990-01-01",
          sexo: "feminino",
          telefone: null,
        });
      });

      expect(signUpResult?.error).not.toBeNull();
      expect(signUpResult?.error?.message).toContain("já está cadastrado");
    });

    it("should handle sign up with duplicate CPF", async () => {
      const { supabase } = await import("@/integrations/supabase/client");

      vi.mocked(supabase.auth.signUp).mockResolvedValueOnce({
        data: {
          user: { id: "test-user-id", email: "test@example.com" } as never,
          session: null,
        },
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValueOnce({
        insert: vi.fn(() =>
          Promise.resolve({
            data: null,
            error: { message: "duplicate key value violates unique constraint cpf" },
          })
        ),
      } as never);

      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signUpResult;
      await act(async () => {
        signUpResult = await result.current.signUp("test@example.com", "password123", {
          nome_completo: "Test User",
          cpf: "12345678900",
          data_nascimento: "1990-01-01",
          sexo: "outro",
          telefone: "61888888888",
        });
      });

      expect(signUpResult?.error).not.toBeNull();
      expect(signUpResult?.error?.message).toContain("CPF já está cadastrado");
    });
  });

  describe("Sign In", () => {
    it("should handle successful sign in", async () => {
      const { supabase } = await import("@/integrations/supabase/client");

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
        data: {
          user: { id: "test-user-id", email: "test@example.com" } as never,
          session: { access_token: "test-token" } as never,
        },
        error: null,
      });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signInResult;
      await act(async () => {
        signInResult = await result.current.signIn("test@example.com", "password123");
      });

      expect(signInResult).toEqual({ error: null });
    });

    it("should handle sign in with invalid credentials", async () => {
      const { supabase } = await import("@/integrations/supabase/client");

      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: "Invalid login credentials", name: "AuthError" } as never,
      });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      let signInResult;
      await act(async () => {
        signInResult = await result.current.signIn("wrong@example.com", "wrongpassword");
      });

      expect(signInResult?.error).not.toBeNull();
      expect(signInResult?.error?.message).toContain("E-mail ou senha incorretos");
    });
  });

  describe("Sign Out", () => {
    it("should sign out successfully", async () => {
      const { supabase } = await import("@/integrations/supabase/client");

      vi.mocked(supabase.auth.signOut).mockResolvedValueOnce({ error: null });

      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.signOut();
      });

      expect(result.current.profile).toBeNull();
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  describe("Refresh Profile", () => {
    it("should not refresh profile when no user", async () => {
      const wrapper = ({ children }: { children: ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      );

      const { result } = renderHook(() => useAuth(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.refreshProfile();
      });

      // Should remain null since no user is logged in
      expect(result.current.profile).toBeNull();
    });
  });
});
