"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentAdmin } from "@/lib/client-auth";
import Sidebar from "@/components/sidebar";

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
      <Sidebar />
      <div className="ml-64 p-8">
        <h1 className="text-2xl font-bold mb-6">Bienvenido al Sistema de Pagos</h1>
        <p className="text-gray-600">
          Seleccione una opción del menú lateral para comenzar.
        </p>
      </div>
    </div>
  );
}
