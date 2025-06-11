import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

interface PDFReceiptProps {
  clientName: string;
  clientStreet: string;
  amount: number;
  amountInWords: string;
  detail: string;
  conceptType: string;
  paymentType: string;
  formattedDate: string;
  number: number;
}

// Registrar fuentes
Font.register({
  family: 'Roboto',
  fonts: [
    // { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal' },
    // { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
  ],
});

// Crear estilos
const styles = StyleSheet.create({
  page: {
    padding: 30,
    // fontFamily: 'Roboto',
    backgroundColor: 'white',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottom: '2px solid #0056b3',
  },
  logoContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    color: '#0056b3',
    fontWeight: 'bold',
    fontSize: 16,
  },
  subtitle: {
    color: '#0056b3',
    fontSize: 12,
    fontWeight: 'normal',
  },
  address: {
    marginTop: 5,
    color: '#555',
    fontSize: 10,
  },
  taxStatus: {
    marginTop: 5,
    color: '#555',
    fontSize: 10,
    fontWeight: 'bold',
  },
  receiptInfo: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    fontSize: 10,
    justifyContent: 'space-between',
  },
  receiptInfoLeft: {
    width: '50%',
    textAlign: 'left',
  },
  receiptInfoRight: {
    width: '50%',
    textAlign: 'right',
  },
  receiptInfoLabel: {
    color: '#333',
    fontWeight: 'bold',
  },
  clientInfo: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 6,
    marginBottom: 20,
  },
  clientRow: {
    flexDirection: 'row',
    marginBottom: 8,
    fontSize: 10,
  },
  clientLabel: {
    color: '#333',
    fontWeight: 'bold',
    width: 100,
  },
  clientText: {
    color: '#333',
  },
  amountRow: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 8,
    fontSize: 10,
  },
  amountLabel: {
    color: '#333',
    fontWeight: 'bold',
    width: 130,
  },
  amountText: {
    color: '#0056b3',
    fontWeight: 'bold',
  },
  amountValue: {
    color: '#0056b3',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  conceptRow: {
    flexDirection: 'row',
    marginBottom: 8,
    fontSize: 10,
  },
  conceptLabel: {
    color: '#333',
    fontWeight: 'bold',
    width: 130,
  },
  conceptText: {
    color: '#333',
  },
  paymentRow: {
    flexDirection: 'row',
    marginTop: 15,
    fontSize: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginTop: 15,
    fontSize: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingTop: 20,
    borderTop: '1px solid #ddd',
  },
  footerLeft: {
    width: '50%',
    textAlign: 'left',
    fontSize: 10,
    fontWeight: 'bold',
  },
  footerRight: {
    width: '50%',
    textAlign: 'right',
  },
  signature: {
    borderTop: '1px solid #333',
    width: 150,
    marginLeft: '55px',
  },
  signatureText: {
    marginTop: 8,
    color: '#555',
    fontSize: 8,
    textAlign: 'center',
  },
  disclaimer: {
    marginTop: 40,
    fontSize: 8,
    textAlign: 'center',
    color: '#777',
    fontStyle: 'italic',
  },
});

export const PDFReceipt = ({
  clientName,
  clientStreet,
  amount,
  amountInWords,
  detail,
  conceptType,
  paymentType,
  formattedDate,
  number
}: PDFReceiptProps) => {
  // Formatear el monto para mostrar
  const formattedAmount = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "ARS",
  }).format(amount);

  const today = new Date();
  const printDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image src="/logo.jpg" style={styles.logo} />
          </View>
          <Text style={styles.title}>CLUB NAUTICO Y PESCA</Text>
          <Text style={styles.subtitle}>Sociedad Civil</Text>
          <Text style={styles.address}>AVENIDA EL LIBANO 1757 - SAN MIGUEL DE TUCUMÁN - IVA EXENTO</Text>
        </View>

        <View style={styles.receiptInfo}>
          <View style={styles.receiptInfoLeft}>
            <Text>
              <Text style={styles.receiptInfoLabel}>RECIBO N°: </Text>
              0001-{Array.from({length: 6-number.toString().length},()=>"0").join("")}{number}
            </Text>
          </View>
          <View style={styles.receiptInfoRight}>
            <Text>
              <Text style={styles.receiptInfoLabel}>FECHA: </Text>
              {formattedDate}
            </Text>
          </View>
        </View>

        <View style={styles.clientInfo}>
          <View style={styles.clientRow}>
            <Text style={styles.clientLabel}>Señor:</Text>
            <Text style={styles.clientText}>{clientName}</Text>
          </View>
          <View style={styles.clientRow}>
            <Text style={styles.clientLabel}>Domicilio:</Text>
            <Text style={styles.clientText}>{clientStreet}</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Recibí la suma de:</Text>
            <Text style={styles.amountText}>{amountInWords}</Text>
            <Text style={styles.amountValue}>({formattedAmount})</Text>
          </View>
          <View style={styles.conceptRow}>
            <Text style={styles.conceptLabel}>En concepto de:</Text>
            <Text style={styles.conceptText}>{conceptType}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.conceptLabel}>Forma de pago:</Text>
            <Text style={styles.conceptText}>{paymentType}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.conceptLabel}>Detalle:</Text>
            <Text style={styles.conceptText}>{detail}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text>{formattedAmount}</Text>
          </View>
          <View style={styles.footerRight}>
            <View style={styles.signature} />
            <Text style={styles.signatureText}>Firma y Aclaración</Text>
          </View>
        </View>

        <Text style={styles.disclaimer}>
          Documento no válido como factura - Impresión: {printDate}
        </Text>
      </Page>
    </Document>
  );
};