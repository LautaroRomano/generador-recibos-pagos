"use client";

import { useEffect, useState } from "react";
import { Payment } from "@/types";
import { clientApi } from "@/lib/api";
import { format, isWithinInterval, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Printer, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import PaymentModal from "./payment-modal";
import EditPaymentModal from "./edit-payment-modal";
import ViewPdf from "./print/ViewPdf";

export default function ReceiptsList() {
  const [receipts, setReceipts] = useState<Payment[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [clientSearch, setClientSearch] = useState<string>("");
  const [paymentType, setPaymentType] = useState<string>("");
  const [printPdf, setPrintPdf] = useState<null | string>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const payments = await clientApi.getAllPayments();
        setReceipts(payments);
      } catch (error) {
        console.error("Error fetching receipts:", error);
      }
    };

    fetchReceipts();
  }, []);

  const handlePrint = (id: string) => {
    setPrintPdf(id);
  };

  const handleSavePayment = async (payment: Payment) => {
    try {
      const newPayment = await clientApi.createPayment(payment);
      setReceipts((prev) => [...prev, newPayment]);
      setIsPaymentModalOpen(false);
      return newPayment;
    } catch (error) {
      console.error("Error saving payment:", error);
      throw error;
    }
  };

  const handleEditPayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsEditModalOpen(true);
  };

  const handleUpdatePayment = async (id: string, paymentData: any) => {
    try {
      const updatedPayment = await clientApi.updatePayment(id, paymentData);
      setReceipts((prev) => 
        prev.map((receipt) => 
          receipt.id === id ? updatedPayment : receipt
        )
      );
      setIsEditModalOpen(false);
      setSelectedPayment(null);
      return updatedPayment;
    } catch (error) {
      console.error("Error updating payment:", error);
      throw error;
    }
  };

  const filteredReceipts = receipts.filter((receipt) => {
    // Filter by date range
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

    // Filter by client name
    if (clientSearch) {
      const searchLower = clientSearch.toLowerCase();
      const clientName = receipt.client?.fullName?.toLowerCase() || "";
      if (!clientName.includes(searchLower)) return false;
    }

    // Filter by payment type
    if (paymentType && receipt.paymentType !== paymentType) {
      return false;
    }

    return true;
  });

  const totalAmount = filteredReceipts.reduce(
    (sum, receipt) =>
      sum + receipt.concepts.reduce((sum, c) => sum + c.amount, 0),
    0
  );

  return (
    <div className="space-y-4">
      <div
        className={`absolute top-0 left-0 w-full h-full bg-black/50 z-50 ${printPdf ? "block" : "hidden"}`}
      >
        <div className="flex justify-center items-center h-full">
          <div className="bg-white rounded-lg shadow-md">
            {printPdf && <ViewPdf id={printPdf} />}
            <div className="flex p-2 justify-end">
              <Button onClick={() => setPrintPdf(null)}>Cerrar</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicial
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Final
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cliente
              </label>
              <Input
                placeholder="Buscar por nombre..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Pago
              </label>
              <select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="">Todos</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Transferencia">Transferencia</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-md">
          <div className="text-sm text-gray-600">
            Mostrando {filteredReceipts.length} recibos
          </div>
          <div className="text-lg font-semibold">
            Total: ${totalAmount.toLocaleString()}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conceptos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReceipts.map((receipt) => (
                <tr key={receipt.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {receipt.client?.fullName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(receipt.date), "PPP", { locale: es })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {receipt.concepts.map((concept) => (
                        <div key={concept.id} className="text-sm">
                          <span className="font-medium">
                            {concept.conceptType}:
                          </span>{" "}
                          ${concept.amount.toLocaleString()}
                          {concept.detail && (
                            <span className="text-gray-500 ml-2">
                              ({concept.detail})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    $
                    {receipt.concepts
                      .reduce((sum, c) => sum + c.amount, 0)
                      .toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {receipt.paymentType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handlePrint(receipt.id)}
                      >
                        <Printer className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only md:inline-block">
                          Imprimir
                        </span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleEditPayment(receipt)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only md:not-sr-only md:inline-block">
                          Editar
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSavePayment={handleSavePayment}
        client={null}
      />

      <EditPaymentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPayment(null);
        }}
        onUpdatePayment={handleUpdatePayment}
        payment={selectedPayment}
      />
    </div>
  );
}
