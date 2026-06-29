"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { clientApi } from "@/lib/api";
import { Payment } from "@/types";
import { PDFViewer } from "@react-pdf/renderer";
import PDFReceiptList from "@/components/PDFReceiptList";
import { parseISO, isWithinInterval } from "date-fns";

export default function ViewReceiptListPdf() {
  const searchParams = useSearchParams();
  const [receipts, setReceipts] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const clientIds = searchParams.get("clientIds") || "";
  const paymentType = searchParams.get("paymentType") || "";

  const clientIdSet = clientIds ? new Set(clientIds.split(",")) : null;

  useEffect(() => {
    setIsMounted(true);
    document.title = "Listado de Recibos";
  }, []);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const data = await clientApi.getAllPayments();

        const filtered = data.filter((receipt) => {
          if (startDate || endDate) {
            const receiptDate = parseISO(receipt.date);
            const start = startDate ? parseISO(startDate) : null;
            const end = endDate ? parseISO(endDate) : null;

            if (start && end) {
              if (!isWithinInterval(receiptDate, { start, end })) return false;
            } else if (start && receiptDate < start) {
              return false;
            } else if (end && receiptDate > end) {
              return false;
            }
          }

          if (clientIdSet && !clientIdSet.has(receipt.clientId)) {
            return false;
          }

          if (paymentType && receipt.paymentType !== paymentType) {
            return false;
          }

          return true;
        });

        setReceipts(filtered);
      } catch (err) {
        console.error("Error al cargar recibos:", err);
        setError("No se pudieron cargar los recibos.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, [startDate, endDate, clientIds, paymentType]);

  const clientNames = clientIdSet
    ? receipts
        .filter((r) => clientIdSet.has(r.clientId))
        .map((r) => r.client?.fullName)
        .filter(Boolean)
    : [];
  const uniqueClientNames = [...new Set(clientNames)];

  const filterDescription = buildFilterDescription(startDate, endDate, uniqueClientNames, paymentType);

  const pdfData = receipts.map((r) => ({
    clientName: r.client?.fullName || "Sin cliente",
    date: r.date,
    amount: r.concepts.reduce((sum, c) => sum + c.amount, 0),
    paymentType: r.paymentType,
  }));

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

  if (receipts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">No se encontraron recibos con los filtros seleccionados.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden min-w-[calc(100vw-250px)]">
      <div className="w-[calc(100vw-250px)] h-[calc(100vh-100px)] p-4">
        <PDFViewer style={{ width: "100%", height: "100vh" }}>
          <PDFReceiptList
            receipts={pdfData}
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

function buildFilterDescription(
  startDate: string,
  endDate: string,
  clientNames: string[],
  paymentType: string
): string {
  const parts: string[] = [];

  if (clientNames.length > 0) {
    if (clientNames.length <= 3) {
      parts.push(`Clientes: ${clientNames.join(", ")}`);
    } else {
      parts.push(`Clientes: ${clientNames.length} seleccionados`);
    }
  }
  if (paymentType) parts.push(`Tipo de Pago: ${paymentType}`);
  if (startDate) {
    const d = new Date(startDate);
    parts.push(`Desde: ${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`);
  }
  if (endDate) {
    const d = new Date(endDate);
    parts.push(`Hasta: ${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}/${d.getFullYear()}`);
  }

  return parts.length > 0 ? `Filtros: ${parts.join(" | ")}` : "Todos los recibos";
}
