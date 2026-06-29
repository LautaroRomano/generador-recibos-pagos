import * as XLSX from "xlsx";

function toExcelDate(dateStr: string): Date {
  const date = new Date(dateStr);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sortByDateDesc<T extends { date: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function applyDateFormat(ws: XLSX.WorkSheet, colIndex: number, rowCount: number) {
  for (let r = 1; r <= rowCount; r++) {
    const cellRef = XLSX.utils.encode_cell({ r, c: colIndex });
    const cell = ws[cellRef];
    if (cell && typeof cell.v !== "string") {
      cell.t = "d";
      cell.z = "DD/MM/YYYY";
    }
  }
}

interface ExpenseExportRow {
  description: string;
  category: string;
  date: string;
  amount: number;
}

export function exportExpensesToExcel(expenses: ExpenseExportRow[], filename?: string) {
  const sorted = sortByDateDesc(expenses);

  const data = sorted.map((e) => ({
    "Descripcion": e.description,
    "Categoria": e.category,
    "Fecha": toExcelDate(e.date),
    "Monto": e.amount,
  }));

  const ws = XLSX.utils.json_to_sheet(data);

  // Apply date format to Fecha column (index 2)
  applyDateFormat(ws, 2, sorted.length);

  // Add total row
  const totalRowIdx = sorted.length + 1;
  XLSX.utils.sheet_add_aoa(ws, [["", "", "TOTAL", expenses.reduce((s, e) => s + e.amount, 0)]], { origin: totalRowIdx });

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
  const sorted = sortByDateDesc(receipts);

  const data = sorted.map((r) => ({
    "Cliente": r.clientName,
    "Fecha": toExcelDate(r.date),
    "Monto": r.amount,
    "Tipo de Pago": r.paymentType,
  }));

  const ws = XLSX.utils.json_to_sheet(data);

  // Apply date format to Fecha column (index 1)
  applyDateFormat(ws, 1, sorted.length);

  // Add total row
  const totalRowIdx = sorted.length + 1;
  XLSX.utils.sheet_add_aoa(ws, [["", "TOTAL", receipts.reduce((s, r) => s + r.amount, 0), ""]], { origin: totalRowIdx });

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
