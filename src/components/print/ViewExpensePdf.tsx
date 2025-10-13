"use client";

import { useEffect, useState } from "react";
import { expenseApi } from "@/lib/api";
import { Expense } from "@/types";
import { PDFViewer } from "@react-pdf/renderer";
import { PDFExpenseReceipt } from "@/components/PDFExpenseReceipt";

export default function ViewExpensePdf({ id }: { id: string }) {
  const [expense, setExpense] = useState<Expense & { number: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        // Obtener el gasto
        const expenseData = await expenseApi.getById(id);
        setExpense(expenseData as Expense & { number: number });

        setLoading(false);
      } catch (err) {
        console.error("Error al cargar el comprobante:", err);
        setError(
          err instanceof Error ? err.message : 
          "No se pudo cargar el comprobante. Por favor, intente nuevamente."
        );
        setLoading(false);
      }
    };

    if (id) {
      fetchExpense();
    }
  }, [id]);

  useEffect(() => {
    setIsMounted(true);
    // Agregar título a la página
    document.title = `Comprobante de gasto - ${expense?.description}`;
  }, [expense?.description]);

  // Formatear la fecha
  const formattedDate = new Date(expense?.date || "").toLocaleDateString(
    "es-ES",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  if (loading || !isMounted) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Cargando comprobante...</p>
      </div>
    );
  }

  if (error || !expense) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">
          {error || "No se encontró el comprobante solicitado"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden min-w-[calc(100vw-250px)]]">
      {/* Visor del PDF */}
      <div className="w-[calc(100vw-250px)] h-[calc(100vh-100px)] p-4">
        <PDFViewer style={{ width: "100%", height: "100vh" }}>
          <PDFExpenseReceipt
            description={expense.description}
            amount={expense.amount}
            category={expense.category}
            date={expense.date}
            receiptUrl={expense.receiptUrl || undefined}
            notes={expense.notes || undefined}
            formattedDate={formattedDate}
            number={expense.number}
          />
        </PDFViewer>
      </div>

      {/* Estilos para impresión */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          @page {
            size: auto;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
