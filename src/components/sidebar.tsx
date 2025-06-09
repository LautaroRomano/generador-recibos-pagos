"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Receipt } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Sistema de Pagos</h1>
      </div>
      <nav className="mt-6">
        <Link
          href="/"
          className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
            isActive("/") ? "bg-gray-100 border-r-4 border-blue-500" : ""
          }`}
        >
          <Home className="w-5 h-5 mr-3" />
          <span>Clientes</span>
        </Link>
        <Link
          href="/receipts"
          className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
            isActive("/receipts") ? "bg-gray-100 border-r-4 border-blue-500" : ""
          }`}
        >
          <Receipt className="w-5 h-5 mr-3" />
          <span>Recibos</span>
        </Link>
      </nav>
    </div>
  );
} 