"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Give session time to load
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status === "loading" || isChecking) return;

    console.log("Admin Layout - Session check:", {
      status,
      session,
      role: session?.user?.role,
    });

    if (status === "unauthenticated" || !session) {
      console.log("Admin Layout - No session, redirecting to signin");
      router.push("/auth/signin?from=/halo-admin-portal-2024");
      return;
    }

    // Allow both ADMIN and STAFF to access admin panel
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "STAFF") {
      console.log("Admin Layout - Unauthorized role:", session?.user?.role);
      router.push("/");
      return;
    }

    console.log("Admin Layout - Access granted for role:", session?.user?.role);
  }, [session, status, router, isChecking]);

  if (status === "loading" || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Don't render children if not authorized
  if (
    !session ||
    (session?.user?.role !== "ADMIN" && session?.user?.role !== "STAFF")
  ) {
    return null;
  }

  return <>{children}</>;
}
