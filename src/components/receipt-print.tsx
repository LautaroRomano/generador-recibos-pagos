import React, { useEffect } from 'react';
import { Client, Payment } from '@/types';
import { Button } from '@/components/ui/button';
import { PrinterIcon } from 'lucide-react';
import Image from 'next/image';

interface ReceiptPrintProps {
  payment: Payment;
  client: Client;
}

export default function ReceiptPrint({ payment, client }: ReceiptPrintProps) {
  useEffect(() => {
    // Agregar título a la página
    document.title = `Recibo de pago - ${client.fullName}`;
  }, [client.fullName]);

  const handlePrint = () => {
    window.print();
  };

  // Formatear la fecha
  const formattedDate = new Date(payment.date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Botón de imprimir (no visible en la impresión) */}
      <div className="p-4 flex justify-end print:hidden">
        <Button onClick={handlePrint} className="bg-primary">
          <PrinterIcon className="h-4 w-4 mr-2" />
          Imprimir Recibo
        </Button>
      </div>

      {/* Contenedor del recibo - dimensiones de 1/4 de A4 */}
      <div className="mx-auto bg-white p-6 shadow-md border border-gray-200 w-[210mm] h-[74.25mm] print:shadow-none print:border-none">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="mr-3">
              <Image src="/logo.png" alt="Logo" width={60} height={60} />
            </div>
            <div>
              <h1 className="text-xl font-bold">RECIBO DE PAGO</h1>
              <p className="text-sm text-gray-600">Digicom</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">Fecha:</p>
            <p className="text-sm">{formattedDate}</p>
          </div>
        </div>

        <div className="mt-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><span className="font-semibold">Cliente:</span> {client.fullName}</p>
              <p><span className="font-semibold">Dirección:</span> {client.street}</p>
            </div>
            <div>
              <p><span className="font-semibold">Concepto:</span> {payment.conceptType}</p>
              <p><span className="font-semibold">Tipo de pago:</span> {payment.paymentType}</p>
            </div>
          </div>

          <div className="mt-6 p-3 bg-gray-50 rounded border">
            <p className="font-semibold text-base mb-2">Detalle:</p>
            <p className="text-sm leading-relaxed min-h-[3rem]">{payment.detail}</p>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-xs italic">Monto en letras: {payment.amountText}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">$ {payment.amount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-dashed border-gray-300 text-xs text-center text-gray-500">
          <p>Este recibo es válido como comprobante de pago</p>
        </div>
      </div>

      {/* Estilos para impresión */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          @page {
            size: 210mm 74.25mm;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
} 