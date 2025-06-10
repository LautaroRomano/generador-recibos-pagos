import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { numberToText } from "@/lib/numberToText";
import { EmailReceipt } from "@/components/EmailReceipt";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, date, amount, concept, paymentType } = body;

    // Validate required fields
    if (!clientId || !date || !amount || !concept || !paymentType) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos" },
        { status: 400 }
      );
    }

    // Convert date string to ISO-8601 DateTime
    const isoDate = new Date(date).toISOString();

    // Check if client exists
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });
    if (!client) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    // Create payment
    const newPayment = await prisma.payment.create({
      data: {
        clientId,
        date: isoDate,
        amount,
        concept,
        paymentType,
        amountText: numberToText(amount),
      },
    });

    // Format date for email
    const formattedDate = new Date(isoDate).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const amountInWords = numberToText(amount);

    // Ensure client data exists and use defaults if not
    const clientName = client.fullName || "Cliente";
    const clientStreet = client.street || "Dirección no especificada";

    // Send email receipt
    await resend.emails.send({
      from: "Digicom <noreply@redapuntes.com>",
      to: client.email || "",
      subject: "Recibo de Pago - Digicom",
      react: EmailReceipt({
        clientName,
        clientStreet,
        amount,
        amountInWords,
        concept,
        paymentType,
        formattedDate,
      }),
    });

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve all payments
export async function GET() {
  const payments = await prisma.payment.findMany({
    include: { client: true },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(payments);
}
