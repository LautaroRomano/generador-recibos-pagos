import * as XLSX from "xlsx";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

interface ExpenseExportRow {
  description: string;
  category: string;
  date: string;
  amount: number;
}

export function exportExpensesToExcel(expenses: ExpenseExportRow[], filename?: string) {
  const data = expenses.map((e) => ({
    "Descripcion": e.description,
    "Categoria": e.category,
    "Fecha": formatDate(e.date),
    "Monto": e.amount,
  }));

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  data.push({
    "Descripcion": "",
    "Categoria": "",
    "Fecha": "TOTAL",
    "Monto": total,
  });

  const ws = XLSX.utils.json_to_sheet(data);

  // Set column widths
  ws["!cols"] = [
    { wch: 35 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Gastos");
  XLSX.writeFile(wb, filename || "listado_gastos.xlsx");
}

interface ReceiptExportRow {
  clientName: string;
  date: string;
  amount: number;
  paymentType: string;
}

export function exportReceiptsToExcel(receipts: ReceiptExportRow[], filename?: string) {
  const data = receipts.map((r) => ({
    "Cliente": r.clientName,
    "Fecha": formatDate(r.date),
    "Monto": r.amount,
    "Tipo de Pago": r.paymentType,
  }));

  const total = receipts.reduce((sum, r) => sum + r.amount, 0);
  data.push({
    "Cliente": "",
    "Fecha": "TOTAL",
    "Monto": total,
    "Tipo de Pago": "",
  });

  const ws = XLSX.utils.json_to_sheet(data);

  ws["!cols"] = [
    { wch: 30 },
    { wch: 15 },
    { wch: 15 },
    { wch: 18 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Recibos");
  XLSX.writeFile(wb, filename || "listado_recibos.xlsx");
}
