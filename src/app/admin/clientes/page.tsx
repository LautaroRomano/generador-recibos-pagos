"use client";
import ClientManagement from "@/components/client-management";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentAdmin } from "@/lib/client-auth";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const admin = getCurrentAdmin();
    if (!admin) {
      router.push("/login");
    }
  }, [router]);

  return (
    <div>
      <ClientManagement />
    </div>
  );
}
