"use client";

import { useEffect, useState } from "react";
import { Payment } from "@/types";
import { clientApi } from "@/lib/api";
import { format, isWithinInterval, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function ReceiptsList() {
  const [receipts, setReceipts] = useState<Payment[]>([]);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [clientSearch, setClientSearch] = useState<string>("");

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

    return true;
  });

  const totalAmount = filteredReceipts.reduce(
    (sum, receipt) => sum + receipt.amount,
    0
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Recibos Generados</h2>

      <div className="space-y-4 mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente..."
            value={clientSearch}
            onChange={(e) => setClientSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
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
          <div className="flex-1">
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
        </div>

        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-md">
          <div className="text-sm text-gray-600">
            Mostrando {filteredReceipts.length} recibos
          </div>
          <div className="text-lg font-semibold">
            Total: ${totalAmount.toLocaleString()}
          </div>
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
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Concepto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo de Pago
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
                <td className="px-6 py-4 whitespace-nowrap">
                  ${receipt.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {receipt.concept}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {receipt.paymentType}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
