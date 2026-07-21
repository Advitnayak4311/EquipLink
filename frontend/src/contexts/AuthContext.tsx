"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { User } from "@/types";
import { authApi } from "@/lib/api/auth";

// ---- Context shape ----

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// ---- Context ----

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ---- Provider ----

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSessionExpired = useCallback(() => {
    setUser(null);
    setIsLoading(false);
  }, []);

  // Listen for the custom "auth_session_expired" event dispatched by Axios interceptor
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("auth_session_expired", handleSessionExpired);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("auth_session_expired", handleSessionExpired);
      }
    };
  }, [handleSessionExpired]);

  // Rehydrate auth state on mount (page refresh)
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---- Hook ----

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
