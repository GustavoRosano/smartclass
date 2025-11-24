"use client";

import React from "react";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import Login from "./Login";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return <>{children}</>;
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGate>{children}</AuthGate>
    </AuthProvider>
  );
}