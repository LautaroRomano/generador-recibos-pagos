"use client";

import { useState, useMemo } from "react";
import { Payment } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { parseISO, isWithinInterval } from "date-fns";
import { exportReceiptsToExcel } from "@/lib/export-excel";
import { FileSpreadsheet } from "lucide-react";

interface PrintReceiptListModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipts: Payment[];
}

export default function PrintReceiptListModal({
  isOpen,
  onClose,
  receipts,
}: PrintReceiptListModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedClientIds, setSelectedClientIds] = useState<Set<string>>(new Set());
  const [allClients, setAllClients] = useState(true);
  const [clientSearch, setClientSearch] = useState("");
  const [paymentType, setPaymentType] = useState("");

  // Get unique clients from receipts
  const uniqueClients = useMemo(() => {
    const map = new Map<string, string>();
    receipts.forEach((r) => {
      if (r.client?.fullName && r.clientId) {
        map.set(r.clientId, r.client.fullName);
      }
    });
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [receipts]);

  // Filter client list by search
  const visibleClients = useMemo(() => {
    if (!clientSearch) return uniqueClients;
    const search = clientSearch.toLowerCase();
    return uniqueClients.filter((c) => c.name.toLowerCase().includes(search));
  }, [uniqueClients, clientSearch]);

  const filteredReceipts = receipts.filter((receipt) => {
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

    if (!allClients && selectedClientIds.size > 0) {
      if (!selectedClientIds.has(receipt.clientId)) return false;
    }

    if (paymentType && receipt.paymentType !== paymentType) {
      return false;
    }

    return true;
  });

  const total = filteredReceipts.reduce(
    (sum, r) => sum + r.concepts.reduce((s, c) => s + c.amount, 0),
    0
  );

  const handleToggleClient = (clientId: string) => {
    setSelectedClientIds((prev) => {
      const next = new Set(prev);
      if (next.has(clientId)) {
        next.delete(clientId);
      } else {
        next.add(clientId);
      }
      return next;
    });
  };

  const handleToggleAll = () => {
    if (allClients) {
      setAllClients(false);
      setSelectedClientIds(new Set());
    } else {
      setAllClients(true);
      setSelectedClientIds(new Set());
    }
  };

  const handleExportExcel = () => {
    exportReceiptsToExcel(
      filteredReceipts.map((r) => ({
        clientName: r.client?.fullName || "Sin cliente",
        date: r.date,
        amount: r.concepts.reduce((s, c) => s + c.amount, 0),
        paymentType: r.paymentType,
      }))
    );
  };

  const handlePrint = () => {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (!allClients && selectedClientIds.size > 0) {
      params.set("clientIds", Array.from(selectedClientIds).join(","));
    }
    if (paymentType) params.set("paymentType", paymentType);

    window.open(`/receipts/print-list?${params.toString()}`, "_blank");
    onClose();
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setSelectedClientIds(new Set());
    setAllClients(true);
    setClientSearch("");
    setPaymentType("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Listado de Recibos Club Nautico</DialogTitle>
          <DialogDescription>
            Seleccione los filtros para el listado a imprimir
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Desde
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Hasta
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Client selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clientes
            </label>
            <div className="border border-gray-300 rounded-md">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 bg-gray-50">
                <input
                  type="checkbox"
                  checked={allClients}
                  onChange={handleToggleAll}
                  className="rounded border-gray-300"
                  id="all-clients"
                />
                <label htmlFor="all-clients" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Todos los clientes
                </label>
              </div>

              {!allClients && (
                <>
                  <div className="px-3 py-2 border-b border-gray-200">
                    <Input
                      placeholder="Buscar cliente..."
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {visibleClients.map((client) => (
                      <label
                        key={client.id}
                        className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedClientIds.has(client.id)}
                          onChange={() => handleToggleClient(client.id)}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{client.name}</span>
                      </label>
                    ))}
                    {visibleClients.length === 0 && (
                      <p className="text-sm text-gray-400 px-3 py-2">No se encontraron clientes</p>
                    )}
                  </div>
                  {selectedClientIds.size > 0 && (
                    <div className="px-3 py-1.5 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
                      {selectedClientIds.size} cliente{selectedClientIds.size !== 1 ? "s" : ""} seleccionado{selectedClientIds.size !== 1 ? "s" : ""}
                    </div>
                  )}
                </>
              )}
            </div>
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

          {/* Preview */}
          <div className="bg-gray-50 p-3 rounded-md space-y-1">
            <div className="text-sm text-gray-600">
              Recibos encontrados: <span className="font-semibold">{filteredReceipts.length}</span>
            </div>
            <div className="text-sm text-gray-600">
              Total: <span className="font-semibold text-green-600">${total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClear}>
            Limpiar Filtros
          </Button>
          <Button
            variant="outline"
            onClick={handleExportExcel}
            disabled={filteredReceipts.length === 0}
            className="text-green-700 border-green-300 hover:bg-green-50"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button
            onClick={handlePrint}
            disabled={filteredReceipts.length === 0}
          >
            Imprimir ({filteredReceipts.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
