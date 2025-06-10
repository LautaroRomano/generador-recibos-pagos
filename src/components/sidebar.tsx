"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Receipt, Users, LogOut } from "lucide-react";
import { logoutAdmin } from "@/lib/client-auth";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await logoutAdmin();
    router.push("/login");
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Sistema de Pagos</h1>
      </div>
      <nav className="mt-6 flex-grow">
        <Link
          href="/admin/clientes"
          className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
            isActive("/admin/clientes")
              ? "bg-gray-100 border-r-4 border-blue-500"
              : ""
          }`}
        >
          <Home className="w-5 h-5 mr-3" />
          <span>Clientes</span>
        </Link>
        <Link
          href="/receipts"
          className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
            isActive("/receipts")
              ? "bg-gray-100 border-r-4 border-blue-500"
              : ""
          }`}
        >
          <Receipt className="w-5 h-5 mr-3" />
          <span>Recibos</span>
        </Link>
        <Link
          href="/admin/users"
          className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
            isActive("/admin/users")
              ? "bg-gray-100 border-r-4 border-blue-500"
              : ""
          }`}
        >
          <Users className="w-5 h-5 mr-3" />
          <span>Administradores</span>
        </Link>
      </nav>
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100 rounded-md"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
}
