"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ExpenseStatsProps {
  stats: {
    total: number;
    count: number;
    byCategory: Array<{
      category: string;
      _sum: { amount: number };
      _count: number;
    }>;
    byDay: Array<{
      date: string;
      _sum: { amount: number };
    }>;
    categories: string[];
  };
  period: "weekly" | "monthly" | "yearly";
}

export default function ExpenseStats({ stats, period }: ExpenseStatsProps) {
  const getPeriodLabel = () => {
    switch (period) {
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
    const now = new Date();
    let start: Date;
    let end: Date = now;

    switch (period) {
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
      end: format(end, "PPP", { locale: es }),
    };
  };

  const dateRange = getPeriodDateRange();

  return (
    <div className="space-y-6">
      {/* Resumen del período */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="text-sm font-medium text-orange-600">Total Gastos</div>
          <div className="text-2xl font-bold text-orange-700">
            ${stats.total.toLocaleString()}
          </div>
          <div className="text-xs text-orange-500">
            {stats.count} gastos registrados
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-blue-600">Período</div>
          <div className="text-lg font-semibold text-blue-700">
            {getPeriodLabel()}
          </div>
          <div className="text-xs text-blue-500">
            {dateRange.start} - {dateRange.end}
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-sm font-medium text-green-600">Promedio Diario</div>
          <div className="text-lg font-semibold text-green-700">
            ${(stats.total / Math.max(stats.byDay.length, 1)).toFixed(2)}
          </div>
          <div className="text-xs text-green-500">
            Basado en {stats.byDay.length} días
          </div>
        </div>
      </div>

      {/* Gastos por categoría */}
      <div className="bg-white p-4 rounded-lg border">
        <h4 className="text-lg font-medium mb-4">Gastos por Categoría</h4>
        <div className="space-y-3">
          {stats.byCategory.map((category) => (
            <div key={category.category} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium">{category.category}</span>
                <span className="text-sm text-gray-500">
                  ({category._count} gastos)
                </span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-orange-600">
                  ${category._sum.amount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  {((category._sum.amount / stats.total) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gráfico de gastos por día */}
      {stats.byDay.length > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="text-lg font-medium mb-4">Evolución de Gastos por Día</h4>
          <div className="space-y-2">
            {stats.byDay.slice(-10).map((day, index) => (
              <div key={day.date} className="flex items-center space-x-3">
                <div className="w-20 text-sm text-gray-600">
                  {format(new Date(day.date), "dd/MM", { locale: es })}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min((day._sum.amount / Math.max(...stats.byDay.map(d => d._sum.amount))) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="w-20 text-right text-sm font-medium">
                  ${day._sum.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Información adicional */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-lg font-medium mb-2">Resumen del Balance</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p>• Período analizado: {getPeriodLabel()}</p>
          <p>• Total de gastos registrados: {stats.count}</p>
          <p>• Categorías utilizadas: {stats.categories.length}</p>
          <p>• Rango de fechas: {dateRange.start} - {dateRange.end}</p>
        </div>
      </div>
    </div>
  );
}
