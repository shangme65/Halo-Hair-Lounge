"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      redirect("/auth/signin");
    }

    // Allow both ADMIN and STAFF to access admin panel
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "STAFF") {
      redirect("/dashboard");
    }
  }, [session, status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
