import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

interface ReceiptRow {
  clientName: string;
  date: string;
  amount: number;
  paymentType: string;
}

interface PDFReceiptListProps {
  receipts: ReceiptRow[];
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
  colClient: {
    width: "35%",
  },
  colDate: {
    width: "20%",
  },
  colAmount: {
    width: "25%",
    textAlign: "right",
  },
  colPaymentType: {
    width: "20%",
  },
  totalRow: {
    flexDirection: "row",
    borderTopWidth: 2,
    borderTopColor: "#1e3a5f",
    marginTop: 2,
    paddingTop: 6,
  },
  totalLabel: {
    width: "55%",
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "right",
    paddingRight: 6,
  },
  totalAmount: {
    width: "25%",
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "right",
    paddingRight: 6,
    color: "#16a34a",
  },
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

export default function PDFReceiptList({ receipts, filterDescription }: PDFReceiptListProps) {
  const total = receipts.reduce((sum, r) => sum + r.amount, 0);
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
        {/* Fixed header */}
        <View style={styles.header} fixed>
          <Text style={styles.title}>Listado de Recibos Club Nautico</Text>
          {hasFilter && (
            <Text style={styles.filterDescription}>{filterDescription}</Text>
          )}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.colClient]}>Cliente</Text>
            <Text style={[styles.headerCell, styles.colDate]}>Fecha</Text>
            <Text style={[styles.headerCell, styles.colAmount]}>Monto</Text>
            <Text style={[styles.headerCell, styles.colPaymentType]}>Tipo de Pago</Text>
          </View>
        </View>

        {/* Table rows */}
        {receipts.map((receipt, index) => (
          <View
            key={index}
            style={[styles.row, index % 2 === 0 ? styles.rowEven : {}]}
            wrap={false}
          >
            <Text style={[styles.cell, styles.colClient]}>
              {receipt.clientName}
            </Text>
            <Text style={[styles.cell, styles.colDate]}>
              {formatDate(receipt.date)}
            </Text>
            <Text style={[styles.cell, styles.colAmount]}>
              ${receipt.amount.toLocaleString()}
            </Text>
            <Text style={[styles.cell, styles.colPaymentType]}>
              {receipt.paymentType}
            </Text>
          </View>
        ))}

        {/* Total */}
        <View style={styles.totalRow} wrap={false}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${total.toLocaleString()}</Text>
        </View>

        {/* Fixed footer */}
        <View style={styles.footer} fixed>
          <Text>Generado el {printDate}</Text>
          <Text>{receipts.length} recibos</Text>
          <Text render={({ pageNumber, totalPages }) => `Pagina ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
