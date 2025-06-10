"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentAdmin } from "@/lib/client-auth";
import Sidebar from "@/components/sidebar";
import ReceiptsList from "@/components/receipts-list";

export default function ReceiptsPage() {
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
      <Sidebar />
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Recibos</h1>
        <p className="text-gray-600">
          Aquí podrá gestionar todos los recibos de pago.
        </p>
        <ReceiptsList />
      </div>
    </div>
  );
}
