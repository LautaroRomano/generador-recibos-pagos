import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

interface ExpenseRow {
  description: string;
  category: string;
  date: string;
  amount: number;
}

interface PDFExpenseListProps {
  expenses: ExpenseRow[];
  filterDescription?: string;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 100,
    paddingBottom: 50,
    paddingHorizontal: 30,
    backgroundColor: "white",
    fontSize: 10,
  },
  pageWithFilter: {
    paddingTop: 115,
    paddingBottom: 50,
    paddingHorizontal: 30,
    backgroundColor: "white",
    fontSize: 10,
  },
  // Fixed header that repeats on every page
  header: {
    position: "absolute",
    top: 20,
    left: 30,
    right: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  filterDescription: {
    fontSize: 9,
    textAlign: "center",
    color: "#666",
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1e3a5f",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  headerCell: {
    color: "white",
    fontWeight: "bold",
    fontSize: 9,
    padding: 6,
  },
  // Table body
  row: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },
  rowEven: {
    backgroundColor: "#f3f4f6",
  },
  cell: {
    fontSize: 9,
    padding: 6,
    color: "#333",
  },
  colDescription: {
    width: "40%",
  },
  colCategory: {
    width: "20%",
  },
  colDate: {
    width: "20%",
  },
  colAmount: {
    width: "20%",
    textAlign: "right",
  },
  // Total row
  totalRow: {
    flexDirection: "row",
    borderTopWidth: 2,
    borderTopColor: "#1e3a5f",
    marginTop: 2,
    paddingTop: 6,
  },
  totalLabel: {
    width: "80%",
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "right",
    paddingRight: 6,
  },
  totalAmount: {
    width: "20%",
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "right",
    paddingRight: 6,
    color: "#dc2626",
  },
  // Fixed footer that repeats on every page
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#999",
    borderTopWidth: 0.5,
    borderTopColor: "#ddd",
    paddingTop: 5,
  },
});

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function PDFExpenseList({ expenses, filterDescription }: PDFExpenseListProps) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const now = new Date();
  const printDate = formatDate(now.toISOString());
  const hasFilter = !!filterDescription;

  return (
    <Document>
      <Page
        size="A4"
        style={hasFilter ? styles.pageWithFilter : styles.page}
        wrap
      >
        {/* Fixed header: repeats on every page */}
        <View style={styles.header} fixed>
          <Text style={styles.title}>Listado de Gastos Club Nautico</Text>
          {hasFilter && (
            <Text style={styles.filterDescription}>{filterDescription}</Text>
          )}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.colDescription]}>Descripcion</Text>
            <Text style={[styles.headerCell, styles.colCategory]}>Categoria</Text>
            <Text style={[styles.headerCell, styles.colDate]}>Fecha</Text>
            <Text style={[styles.headerCell, styles.colAmount]}>Monto</Text>
          </View>
        </View>

        {/* Table rows: will wrap across pages automatically */}
        {expenses.map((expense, index) => (
          <View
            key={index}
            style={[styles.row, index % 2 === 0 ? styles.rowEven : {}]}
            wrap={false}
          >
            <Text style={[styles.cell, styles.colDescription]}>
              {expense.description}
            </Text>
            <Text style={[styles.cell, styles.colCategory]}>
              {expense.category}
            </Text>
            <Text style={[styles.cell, styles.colDate]}>
              {formatDate(expense.date)}
            </Text>
            <Text style={[styles.cell, styles.colAmount]}>
              ${expense.amount.toLocaleString()}
            </Text>
          </View>
        ))}

        {/* Total row */}
        <View style={styles.totalRow} wrap={false}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${total.toLocaleString()}</Text>
        </View>

        {/* Fixed footer: repeats on every page with page number */}
        <View style={styles.footer} fixed>
          <Text>Generado el {printDate}</Text>
          <Text>{expenses.length} gastos</Text>
          <Text render={({ pageNumber, totalPages }) => `Pagina ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
