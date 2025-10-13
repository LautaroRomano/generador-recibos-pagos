"use client";

import { useState } from "react";
import { Expense } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, ExternalLink, Printer } from "lucide-react";

interface ExpenseTableProps {
  expenses: Expense[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  onPrintExpense: (expense: Expense) => void;
}

export default function ExpenseTable({ 
  expenses, 
  onEditExpense, 
  onDeleteExpense,
  onPrintExpense
}: ExpenseTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
    "Otros"
  ];

  const filteredExpenses = expenses.filter((expense) => {
    // Filtro por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const description = expense.description.toLowerCase();
      const notes = expense.notes?.toLowerCase() || "";
      
      if (!description.includes(searchLower) && !notes.includes(searchLower)) {
        return false;
      }
    }

    // Filtro por categoría
    if (categoryFilter && expense.category !== categoryFilter) {
      return false;
    }

    // Filtro por fecha
    if (startDate || endDate) {
      const expenseDate = new Date(expense.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && expenseDate < start) return false;
      if (end && expenseDate > end) return false;
    }

    return true;
  });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleDelete = (id: string) => {
    if (confirm("¿Está seguro de que desea eliminar este gasto?")) {
      onDeleteExpense(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <Input
            placeholder="Buscar por descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Todas las categorías</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Inicial
          </label>
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
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
          />
        </div>
      </div>

      {/* Resumen */}
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-md">
        <div className="text-sm text-gray-600">
          Mostrando {filteredExpenses.length} gastos
        </div>
        <div className="text-lg font-semibold text-red-600">
          Total: ${totalAmount.toLocaleString()}
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recibo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredExpenses.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {expense.description}
                    </div>
                    {expense.notes && (
                      <div className="text-sm text-gray-500">
                        {expense.notes}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {format(new Date(expense.date), "PPP", { locale: es })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                  ${expense.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {expense.receiptUrl ? (
                    <a
                      href={expense.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onPrintExpense(expense)}
                      className="text-green-600 hover:text-green-800"
                      title="Imprimir comprobante"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditExpense(expense)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Editar gasto"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(expense.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar gasto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredExpenses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No se encontraron gastos que coincidan con los filtros aplicados.
        </div>
      )}
    </div>
  );
}
