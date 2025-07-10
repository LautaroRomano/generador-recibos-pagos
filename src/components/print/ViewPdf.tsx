"use client";

import { useEffect, useState } from "react";
import { clientApi } from "@/lib/api";
import { Payment, Client } from "@/types";
import { PDFViewer } from "@react-pdf/renderer";
import { PDFReceipt } from "@/components/PDFReceipt";

export default function ViewPdf({ id }: { id: string }) {
  const [payment, setPayment] = useState<Payment | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        // Obtener el pago
        const paymentData = await clientApi.getPaymentById(id);
        setPayment(paymentData);

        // Obtener cliente relacionado
        if (paymentData.clientId) {
          const clientData = await clientApi.getClientById(
            paymentData.clientId
          );
          setClient(clientData);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error al cargar el recibo:", err);
        setError("No se pudo cargar el recibo. Por favor, intente nuevamente.");
        setLoading(false);
      }
    };

    if (id) {
      fetchPayment();
    }
  }, [id]);

  useEffect(() => {
    setIsMounted(true);
    // Agregar título a la página
    document.title = `Recibo de pago - ${client?.fullName}`;
  }, [client?.fullName]);

  // Formatear la fecha
  const formattedDate = new Date(payment?.date || "").toLocaleDateString(
    "es-ES",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  if (loading || !isMounted) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)] min-w-[calc(100vw-100px)]">
        <p>Cargando recibo...</p>
      </div>
    );
  }

  if (error || !payment || !client) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">
          {error || "No se encontró el recibo solicitado"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden min-w-[calc(100vw-100px)]">
      {/* Visor del PDF */}
      <div className="w-full h-[calc(100vh-100px)] p-4">
        <PDFViewer style={{ width: "100%", height: "100vh" }}>
          <PDFReceipt
            clientName={client.fullName}
            clientStreet={client.street || "Dirección no especificada"}
            clientLote={client.lote}
            clientPhone={client.phone}
            amount={payment.concepts.reduce((sum, c) => sum + c.amount, 0)}
            amountInWords={payment.amountText}
            detail={payment.concepts.map(c => `${c.conceptType}: ${c.detail}`).join("\n")}
            conceptType={payment.concepts.map(c => c.conceptType).join(", ")}
            paymentType={payment.paymentType}
            formattedDate={formattedDate}
            number={payment.number}
            concepts={payment.concepts}
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
