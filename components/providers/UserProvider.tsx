"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authClient } from "@/lib/auth/utils/client-auth";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: "vendor" | "admin" | "super_admin" | "customer";
  status: string;
  isVerified: boolean;
  avatarUrl?: string;
}

interface UserContextType {
  user: User | null;
  vendor: any | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [vendor, setVendor] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response: any = await authClient.getProfile();
      
      if (response.success && response.data) {
        setUser(response.data.user);
        setVendor(response.data.vendor);
        setError(null);
      } else {
        setUser(null);
        setVendor(null);
        // Don't set error on 401 as it's a normal state for unauthenticated users
        if (response.message && !response.message.includes("Unauthorized")) {
          setError(response.message);
        }
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setError("Failed to load user profile");
      setUser(null);
      setVendor(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <UserContext.Provider
      value={{
        user,
        vendor,
        loading,
        error,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
