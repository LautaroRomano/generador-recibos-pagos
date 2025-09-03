"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentAdmin } from "@/lib/client-auth";
import ExpenseManagement from "@/components/expense-management";

export default function GastosPage() {
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
      <ExpenseManagement />
    </div>
  );
}
