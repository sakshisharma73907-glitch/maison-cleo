import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { api, apiErrorMessage } from "../lib/api";
import type { ApiUser } from "../lib/types";

type AuthContextValue = {
  user: ApiUser | null;
  loading: boolean;
  login(email: string, password: string): Promise<void>;
  register(input: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<void>;
  logout(): Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get<{ user: ApiUser | null }>("/auth/me")
      .then((res) => {
        if (active) setUser(res.data.user);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function login(email: string, password: string) {
    try {
      const res = await api.post<{ user: ApiUser }>("/auth/login", {
        email,
        password,
      });
      setUser(res.data.user);
    } catch (e) {
      throw new Error(apiErrorMessage(e));
    }
  }

  async function register(input: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    try {
      const res = await api.post<{ user: ApiUser }>("/auth/register", input);
      setUser(res.data.user);
    } catch (e) {
      throw new Error(apiErrorMessage(e));
    }
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch {
      // network failure — clear locally regardless
    }
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}