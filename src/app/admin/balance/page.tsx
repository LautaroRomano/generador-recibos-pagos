"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentAdmin } from "@/lib/client-auth";
import BalanceGeneral from "@/components/balance-general";

export default function BalancePage() {
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
      <BalanceGeneral />
    </div>
  );
}
