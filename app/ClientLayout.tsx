"use client";

import React from "react";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import Login from "./Login";

import Header from "@/components/Header";
import HeaderMobile from "@/components/Header/Mobile";

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <Header />
      {children}
      <HeaderMobile />
    </>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthGate>{children}</AuthGate>
    </AuthProvider>
  );
}