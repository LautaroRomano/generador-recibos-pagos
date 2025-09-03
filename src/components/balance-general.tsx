"use client";

import { useState, useEffect } from "react";
import { clientApi, expenseApi } from "@/lib/api";
import { Payment, Expense } from "@/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";

export default function BalanceGeneral() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedPeriod, startDate, endDate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Obtener pagos
      const paymentsData = await clientApi.getAllPayments();
      const filteredPayments = filterByPeriod(paymentsData);
      setPayments(filteredPayments);

      // Obtener gastos
      const expensesData = await expenseApi.getAll();
      const filteredExpenses = filterByPeriod(expensesData);
      setExpenses(filteredExpenses);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterByPeriod = (data: any[]) => {
    if (startDate && endDate) {
      return data.filter(item => {
        const itemDate = new Date(item.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return itemDate >= start && itemDate <= end;
      });
    }

    const now = new Date();
    let start: Date;

    switch (selectedPeriod) {
      case "weekly":
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "monthly":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "yearly":
        start = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        start = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= now;
    });
  };

  const calculateTotals = () => {
    const totalIncome = payments.reduce((sum, payment) => {
      return sum + payment.concepts.reduce((sum, c) => sum + c.amount, 0);
    }, 0);

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netIncome = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      netIncome,
      profitMargin: totalIncome > 0 ? ((netIncome / totalIncome) * 100) : 0
    };
  };

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "weekly":
        return "Semanal";
      case "monthly":
        return "Mensual";
      case "yearly":
        return "Anual";
      default:
        return "Mensual";
    }
  };

  const getPeriodDateRange = () => {
    if (startDate && endDate) {
      return {
        start: format(new Date(startDate), "PPP", { locale: es }),
        end: format(new Date(endDate), "PPP", { locale: es }),
      };
    }

    const now = new Date();
    let start: Date;

    switch (selectedPeriod) {
      case "weekly":
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "monthly":
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "yearly":
        start = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        start = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return {
      start: format(start, "PPP", { locale: es }),
      end: format(now, "PPP", { locale: es }),
    };
  };

  const totals = calculateTotals();
  const dateRange = getPeriodDateRange();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando balance...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Balance General</h2>
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

        {/* Filtros de fecha personalizada */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Inicial
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Final
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>

        {/* Resumen del período */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="text-sm text-gray-600">
            Período: {getPeriodLabel()} - {dateRange.start} a {dateRange.end}
          </div>
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <div className="text-sm font-medium text-green-600">Ingresos</div>
                <div className="text-2xl font-bold text-green-700">
                  ${totals.totalIncome.toLocaleString()}
                </div>
                <div className="text-xs text-green-500">
                  {payments.length} pagos recibidos
                </div>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <div className="flex items-center">
              <TrendingDown className="w-8 h-8 text-red-600 mr-3" />
              <div>
                <div className="text-sm font-medium text-red-600">Gastos</div>
                <div className="text-2xl font-bold text-red-700">
                  ${totals.totalExpenses.toLocaleString()}
                </div>
                <div className="text-xs text-red-500">
                  {expenses.length} gastos registrados
                </div>
              </div>
            </div>
          </div>

          <div className={`p-6 rounded-lg border ${
            totals.netIncome >= 0 
              ? "bg-green-50 border-green-200" 
              : "bg-red-50 border-red-200"
          }`}>
            <div className="flex items-center">
              <DollarSign className={`w-8 h-8 mr-3 ${
                totals.netIncome >= 0 ? "text-green-600" : "text-red-600"
              }`} />
              <div>
                <div className={`text-sm font-medium ${
                  totals.netIncome >= 0 ? "text-green-600" : "text-red-600"
                }`}>
                  Resultado Neto
                </div>
                <div className={`text-2xl font-bold ${
                  totals.netIncome >= 0 ? "text-green-700" : "text-red-700"
                }`}>
                  ${totals.netIncome.toLocaleString()}
                </div>
                <div className={`text-xs ${
                  totals.netIncome >= 0 ? "text-green-500" : "text-red-500"
                }`}>
                  {totals.profitMargin.toFixed(1)}% del total
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <div className="text-sm font-medium text-blue-600">Eficiencia</div>
                <div className="text-2xl font-bold text-blue-700">
                  {totals.totalIncome > 0 
                    ? ((totals.totalIncome / (totals.totalIncome + totals.totalExpenses)) * 100).toFixed(1)
                    : "0"
                  }%
                </div>
                <div className="text-xs text-blue-500">
                  Ingresos vs Total
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de comparación */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">Comparación Ingresos vs Gastos</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Ingresos</span>
                <span>${totals.totalIncome.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-500 h-3 rounded-full"
                  style={{
                    width: `${totals.totalIncome > 0 ? (totals.totalIncome / Math.max(totals.totalIncome, totals.totalExpenses)) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Gastos</span>
                <span>${totals.totalExpenses.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-red-500 h-3 rounded-full"
                  style={{
                    width: `${totals.totalExpenses > 0 ? (totals.totalExpenses / Math.max(totals.totalIncome, totals.totalExpenses)) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
