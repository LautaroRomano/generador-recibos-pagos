import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    Image,
} from "@react-pdf/renderer";

interface PDFExpenseReceiptProps {
    description: string;
    amount: number;
    category: string;
    date: string;
    receiptUrl: string | undefined;
    notes: string | undefined;
    formattedDate: string;
    number: number;
}

// Registrar fuentes
Font.register({
    family: "Roboto",
    fonts: [
        // { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal' },
        // { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
    ],
});

// Crear estilos
const styles = StyleSheet.create({
    page: {
        padding: 15,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    receiptContainer: {
        width: "48%",
        padding: 15,
    },
    header: {
        textAlign: "center",
        marginBottom: 15,
        paddingBottom: 15,
        borderBottom: "2px solid #0056b3",
    },
    logoContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 8,
    },
    logo: {
        width: 60,
        height: 60,
    },
    title: {
        color: "#0056b3",
        fontWeight: "bold",
        fontSize: 14,
    },
    subtitle: {
        color: "#0056b3",
        fontSize: 11,
        fontWeight: "normal",
    },
    address: {
        marginTop: 3,
        color: "#555",
        fontSize: 9,
    },
    receiptInfo: {
        flexDirection: "row",
        backgroundColor: "#f8f9fa",
        padding: 8,
        borderRadius: 4,
        marginBottom: 15,
        fontSize: 10,
        justifyContent: "space-between",
    },
    receiptInfoLeft: {
        width: "50%",
        textAlign: "left",
    },
    receiptInfoRight: {
        width: "50%",
        textAlign: "right",
    },
    receiptInfoLabel: {
        color: "#333",
        fontWeight: "bold",
    },
    clientInfo: {
        backgroundColor: "#f8f9fa",
        padding: 12,
        borderRadius: 4,
        marginBottom: 15,
    },
    clientRowContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 8,
    },
    clientRow: {
        flexDirection: "row",
        marginBottom: 6,
        fontSize: 10,
    },
    clientLabel: {
        color: "#333",
        fontWeight: "bold",
        width: 75,
    },
    clientText: {
        color: "#333",
        width: 225,
    },
    amountRow: {
        flexDirection: "row",
        marginTop: 10,
        marginBottom: 6,
        fontSize: 10,
    },
    amountLabel: {
        color: "#333",
        fontWeight: "bold",
        width: 80,
    },
    amountText: {
        color: "#0056b3",
        fontWeight: "bold",
    },
    amountValue: {
        color: "#0056b3",
        fontWeight: "bold",
        marginLeft: 8,
    },
    conceptRow: {
        flexDirection: "row",
        marginBottom: 6,
        fontSize: 10,
    },
    conceptLabel: {
        color: "#333",
        fontWeight: "bold",
        width: 80,
    },
    conceptText: {
        color: "#333",
    },
    paymentRow: {
        flexDirection: "row",
        marginTop: 10,
        fontSize: 10,
    },
    detailRow: {
        flexDirection: "row",
        marginTop: 10,
        fontSize: 10,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
        paddingTop: 15,
        borderTop: "1px solid #ddd",
    },
    footerLeft: {
        width: "50%",
        textAlign: "left",
        fontSize: 10,
        fontWeight: "bold",
    },
    footerRight: {
        width: "50%",
        textAlign: "right",
    },
    signature: {
        borderTop: "1px solid #333",
        width: 160,
        marginLeft: "auto",
    },
    signatureText: {
        marginTop: 6,
        color: "#555",
        fontSize: 9,
        textAlign: "center",
    },
    disclaimer: {
        marginTop: 25,
        fontSize: 9,
        textAlign: "center",
        color: "#777",
        fontStyle: "italic",
    },
    conceptsTable: {
        marginTop: 15,
        marginBottom: 15,
    },
    conceptsHeader: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingBottom: 3,
        marginBottom: 3,
    },
    conceptsRow: {
        flexDirection: "row",
        marginBottom: 3,
    },
    conceptType: {
        width: "20%",
        fontSize: 9,
    },
    conceptAmount: {
        width: "20%",
        fontSize: 9,
        textAlign: "right",
    },
    conceptDetail: {
        width: "60%",
        fontSize: 8,
        textAlign: "left",
        marginLeft: 8,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
    totalLabel: {
        fontSize: 10,
        fontWeight: "bold",
        marginRight: 8,
    },
    totalAmount: {
        fontSize: 10,
        fontWeight: "bold",
    },
});

const SingleExpense = ({
    description,
    amount,
    category,
    date,
    receiptUrl,
    notes,
    formattedDate,
    number,
}: PDFExpenseReceiptProps) => {
    // Formatear el monto para mostrar
    const formattedAmount = new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "ARS",
    }).format(amount);

    const today = new Date();
    const printDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

    return (
        <View style={styles.receiptContainer}>
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image src="/logo.jpg" style={styles.logo} />
                </View>
                <Text style={styles.title}>CLUB NAUTICO Y PESCA</Text>
                <Text style={styles.subtitle}>Sociedad Civil</Text>
                <Text style={styles.address}>
                    AVENIDA EL LIBANO 1757 - SAN MIGUEL DE TUCUMÁN - IVA EXENTO
                </Text>
                <Text style={styles.address}>C.U.I.T.: 30-71480079-1</Text>
            </View>

            <View style={styles.receiptInfo}>
                <View style={styles.receiptInfoLeft}>
                    <Text>
                        <Text style={styles.receiptInfoLabel}>RECIBO N°: </Text>
                        0001-
                        {Array.from(
                            { length: 6 - number.toString().length },
                            () => "0"
                        ).join("")}
                        {number}
                    </Text>
                </View>
                <View style={styles.receiptInfoRight}>
                    <Text >
                        <Text style={styles.receiptInfoLabel}>MONTO PAGADO: </Text>
                        {formattedAmount}
                    </Text>
                </View>
            </View>

            <View style={styles.clientInfo}>
                <View style={styles.clientRowContainer}>
                    <View style={styles.clientRow}>
                        <Text style={styles.clientLabel}>Descripción:</Text>
                        <Text style={styles.clientText}>{description}</Text>
                    </View>
                </View>
                <View style={styles.clientRowContainer}>
                    {category && (
                        <View style={styles.clientRow}>
                            <Text style={styles.clientLabel}>Categoría:</Text>
                            <Text style={styles.clientText}>{category}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.clientRowContainer}>
                    {notes && (
                        <View style={styles.clientRow}>
                            <Text style={styles.clientLabel}>Notas:</Text>
                            <Text style={styles.clientText}>{notes}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.clientRowContainer}>
                    {receiptUrl && (
                        <View style={styles.clientRow}>
                            <Text style={styles.clientLabel}>Recibo:</Text>
                            <Text style={styles.clientText}>{receiptUrl}</Text>
                        </View>
                    )}
                </View>
                <View style={styles.clientRowContainer}>
                    {formattedDate && (
                        <View style={styles.clientRow}>
                            <Text style={styles.clientLabel}>Fecha:</Text>
                            <Text style={styles.clientText}>{formattedDate}</Text>
                        </View>
                    )}
                </View>

            </View>

            <View style={styles.footer}>
                <View style={styles.footerLeft}>
                </View>
                <View style={styles.footerRight}>
                    <View style={styles.signature} />
                    <Text style={styles.signatureText}>Firma y Aclaración</Text>
                </View>
            </View>

            <Text style={styles.disclaimer}>
                Documento no válido como factura - Impresión: {printDate}
            </Text>
        </View>
    );
};

export const PDFExpenseReceipt = ({
    description,
    amount,
    category,
    date,
    receiptUrl,
    notes,
    formattedDate,
    number,
}: PDFExpenseReceiptProps) => {
    return (
        <Document>
            <Page size="A4" orientation="landscape" style={styles.page}>
                <SingleExpense
                    description={description}
                    amount={amount}
                    category={category}
                    date={date}
                    receiptUrl={receiptUrl}
                    notes={notes}
                    formattedDate={formattedDate}
                    number={number}
                />
                <SingleExpense
                    description={description}
                    amount={amount}
                    category={category}
                    date={date}
                    receiptUrl={receiptUrl}
                    notes={notes}
                    formattedDate={formattedDate}
                    number={number}
                />
            </Page>
        </Document>
    );
};
