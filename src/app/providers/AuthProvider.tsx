// app/providers/AuthProvider.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "../../../lib/supabaseClient";
import { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  isSessionLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  // Retrieve current session on mount
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("Error getting session:", error.message);
      }

      setUser(session?.user ?? null);
      setIsSessionLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
        setIsSessionLoading(false);
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  const signIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) {
      console.error("Error signing in:", error.message);
    }
  };

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    }
  }, []);

  // Domain restriction once user is known
  useEffect(() => {
    if (!isSessionLoading && user?.email) {
      const allowedDomains = ["moe.gov.my", "moe-dl.edu.my"];
      const userDomain = user.email.split("@")[1];
      if (!allowedDomains.includes(userDomain)) {
        alert("Your email domain is not allowed. You will be signed out.");
        signOut();
      }
    }
  }, [user, isSessionLoading, signOut]);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isSessionLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
