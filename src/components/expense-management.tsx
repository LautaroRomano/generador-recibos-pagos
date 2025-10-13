"use client";

import { useState, useEffect } from "react";
import ExpenseForm from "./expense-form";
import ExpenseTable from "./expense-table";
import ExpenseStats from "./expense-stats";
import { toast } from "sonner";
import { expenseApi } from "@/lib/api";
import { Expense } from "@/types";
import EditExpenseModal from "./edit-expense-modal";

export default function ExpenseManagement() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [activeTab, setActiveTab] = useState<"form" | "stats" | "list">("form");

  const getExpenses = async () => {
    try {
      const expenses = await expenseApi.getAll();
      setExpenses(expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Error al cargar los gastos");
    }
  };

  const getStats = async () => {
    try {
      const statsData = await expenseApi.getStats({ period: selectedPeriod });
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    getExpenses();
  }, []);

  useEffect(() => {
    getStats();
  }, [selectedPeriod]);

  // Función para agregar un nuevo gasto
  const handleAddExpense = async (expense: Omit<Expense, "id" | "createdAt" | "updatedAt">) => {
    try {
      const newExpense = await expenseApi.create(expense);
      setExpenses([newExpense, ...expenses]);
      toast.success("Gasto registrado correctamente");
      getStats(); // Actualizar estadísticas
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || error.message || 
        "Error al registrar el gasto. Por favor, intente nuevamente."
      );
      console.error("Error creating expense:", error);
    }
  };

  // Función para editar un gasto
  const handleEditExpense = async (expense: Omit<Expense, "id" | "createdAt" | "updatedAt">) => {
    if (!selectedExpense) return;

    try {
      const updatedExpense = await expenseApi.update(selectedExpense.id, expense);
      setExpenses(expenses.map(e => e.id === selectedExpense.id ? updatedExpense : e));
      setIsEditModalOpen(false);
      toast.success("Gasto actualizado correctamente");
      getStats(); // Actualizar estadísticas
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || error.message || 
        "Error al actualizar el gasto. Por favor, intente nuevamente."
      );
      console.error("Error updating expense:", error);
    }
  };

  // Función para eliminar un gasto
  const handleDeleteExpense = async (id: string) => {
    try {
      await expenseApi.delete(id);
      setExpenses(expenses.filter(e => e.id !== id));
      toast.success("Gasto eliminado correctamente");
      getStats(); // Actualizar estadísticas
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || error.message || 
        "Error al eliminar el gasto. Por favor, intente nuevamente."
      );
      console.error("Error deleting expense:", error);
    }
  };

  // Función para abrir el modal de edición
  const handleOpenEditModal = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsEditModalOpen(true);
  };

  // Función para imprimir el comprobante de gasto
  const handlePrintExpense = (expense: Expense) => {
    // Abrir nueva ventana con el PDF del gasto
    window.open(`/expenses/print/${expense.id}`, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Navegación de Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("form")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "form"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Gestión de Gastos
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "stats"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Estadísticas y Balance
            </button>
            <button
              onClick={() => setActiveTab("list")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "list"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Listado de Gastos
            </button>
          </nav>
        </div>

        {/* Contenido de las Tabs */}
        <div className="p-6">
          {activeTab === "form" && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Gestión de Gastos</h2>
              <ExpenseForm onAddExpense={handleAddExpense} />
            </div>
          )}

          {activeTab === "stats" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-medium">Estadísticas y Balance</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedPeriod("weekly")}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      selectedPeriod === "weekly"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Semanal
                  </button>
                  <button
                    onClick={() => setSelectedPeriod("monthly")}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      selectedPeriod === "monthly"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Mensual
                  </button>
                  <button
                    onClick={() => setSelectedPeriod("yearly")}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      selectedPeriod === "yearly"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Anual
                  </button>
                </div>
              </div>
              {stats && <ExpenseStats stats={stats} period={selectedPeriod} />}
            </div>
          )}

          {activeTab === "list" && (
            <div>
              <h3 className="text-xl font-medium mb-4">Listado de Gastos</h3>
              <ExpenseTable
                expenses={expenses}
                onEditExpense={handleOpenEditModal}
                onDeleteExpense={handleDeleteExpense}
                onPrintExpense={handlePrintExpense}
              />
            </div>
          )}
        </div>
      </div>

      <EditExpenseModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditExpense}
        expense={selectedExpense}
      />
    </div>
  );
}
