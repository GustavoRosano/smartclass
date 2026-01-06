"use client";

import React from "react";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import { usePathname } from "next/navigation";

import Login from "./login";

import Header from "@/components/Header";
import HeaderMobile from "@/components/Header/Mobile";

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.some(route => pathname?.startsWith(route));

  if (isPublicRoute) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div>Carregando...</div>
      </div>
    );
  }

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