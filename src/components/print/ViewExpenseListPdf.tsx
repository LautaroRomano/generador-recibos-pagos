"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { expenseApi } from "@/lib/api";
import { Expense } from "@/types";
import { PDFViewer } from "@react-pdf/renderer";
import PDFExpenseList from "@/components/PDFExpenseList";

export default function ViewExpenseListPdf() {
  const searchParams = useSearchParams();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    setIsMounted(true);
    document.title = "Listado de Gastos";
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const params: { startDate?: string; endDate?: string; category?: string } = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        if (category) params.category = category;

        const data = await expenseApi.getAll(params);
        setExpenses(data);
      } catch (err) {
        console.error("Error al cargar gastos:", err);
        setError("No se pudieron cargar los gastos.");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [startDate, endDate, category]);

  const filterDescription = buildFilterDescription(startDate, endDate, category);

  if (loading || !isMounted) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Cargando listado...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">No se encontraron gastos con los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden min-w-[calc(100vw-250px)]">
      <div className="w-[calc(100vw-250px)] h-[calc(100vh-100px)] p-4">
        <PDFViewer style={{ width: "100%", height: "100vh" }}>
          <PDFExpenseList
            expenses={expenses}
            filterDescription={filterDescription}
          />
        </PDFViewer>
      </div>

      <style jsx global>{`
        @media print {
          body { margin: 0; padding: 0; }
          @page { size: auto; margin: 0; }
        }
      `}</style>
    </div>
  );
}

function buildFilterDescription(startDate: string, endDate: string, category: string): string {
  const parts: string[] = [];

  if (category) parts.push(`Categoria: ${category}`);
  if (startDate) {
    const d = new Date(startDate);
    parts.push(`Desde: ${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`);
  }
  if (endDate) {
    const d = new Date(endDate);
    parts.push(`Hasta: ${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`);
  }

  return parts.length > 0 ? `Filtros: ${parts.join(" | ")}` : "Todos los gastos";
}
