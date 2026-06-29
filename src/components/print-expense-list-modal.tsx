"use client";

import { useState } from "react";
import { Expense } from "@/types";
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

const EXPENSE_CATEGORIES = [
  "Servicios Públicos",
  "Alquiler",
  "Salarios",
  "Materiales",
  "Equipamiento",
  "Mantenimiento",
  "Marketing",
  "Transporte",
  "Seguros",
  "Impuestos",
  "Otros",
];

interface PrintExpenseListModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
}

export default function PrintExpenseListModal({
  isOpen,
  onClose,
  expenses,
}: PrintExpenseListModalProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("");

  const filteredExpenses = expenses.filter((expense) => {
    if (category && expense.category !== category) return false;

    if (startDate || endDate) {
      const expenseDate = new Date(expense.date);
      if (startDate && expenseDate < new Date(startDate)) return false;
      if (endDate && expenseDate > new Date(endDate)) return false;
    }

    return true;
  });

  const total = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handlePrint = () => {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (category) params.set("category", category);

    window.open(`/expenses/print-list?${params.toString()}`, "_blank");
    onClose();
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setCategory("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Listado de Gastos Club Nautico</DialogTitle>
          <DialogDescription>
            Seleccione los filtros para el listado a imprimir
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="">Todas las categorias</option>
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

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

          {/* Preview del resultado */}
          <div className="bg-gray-50 p-3 rounded-md space-y-1">
            <div className="text-sm text-gray-600">
              Gastos encontrados: <span className="font-semibold">{filteredExpenses.length}</span>
            </div>
            <div className="text-sm text-gray-600">
              Total: <span className="font-semibold text-red-600">${total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClear}>
            Limpiar Filtros
          </Button>
          <Button
            onClick={handlePrint}
            disabled={filteredExpenses.length === 0}
          >
            Imprimir ({filteredExpenses.length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
