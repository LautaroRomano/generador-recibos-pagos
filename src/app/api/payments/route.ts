import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { numberToText } from "@/lib/numberToText";
import { EmailReceipt } from "@/components/EmailReceipt";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, date, concepts, paymentType } = body;

    // Validate required fields
    if (
      !clientId ||
      !date ||
      !concepts ||
      !paymentType ||
      !Array.isArray(concepts) ||
      concepts.length === 0
    ) {
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

    const countPayments = await prisma.payment.count();

    // Calcular el monto total
    const totalAmount = concepts.reduce(
      (sum, concept) => sum + concept.amount,
      0
    );

    // Create payment with concepts
    const newPayment = await prisma.payment.create({
      data: {
        clientId,
        date: isoDate,
        paymentType,
        amountText: numberToText(totalAmount),
        number: countPayments + 1,
        concepts: {
          create: concepts.map((concept) => ({
            conceptType: concept.conceptType,
            amount: concept.amount,
            detail: concept.detail,
          })),
        },
      },
      include: {
        concepts: true,
      },
    });

    // Format date for email
    const formattedDate = new Date(isoDate).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Ensure client data exists and use defaults if not
    const clientName = client.fullName || "Cliente";
    const clientStreet = client.street || "Dirección no especificada";
    const clientLote = client.lote || undefined;
    const clientPhone = client.phone || undefined;

    if (!!client.email) {
      // Send email receipt
      await resend.emails.send({
        from: "Club Nautico y Pesca <noreply@digicom.net.ar>",
        to: client.email,
        subject: "Recibo de Pago - Club Nautico y Pesca",
        react: EmailReceipt({
          clientName,
          clientStreet,
          clientLote,
          clientPhone,
          amount: totalAmount,
          amountInWords: numberToText(totalAmount),
          detail: concepts
            .map((c) => `${c.conceptType}: ${c.detail}`)
            .join("\n"),
          conceptType: concepts.map((c) => c.conceptType).join(", "),
          paymentType,
          formattedDate,
          number: newPayment.number || 0,
          concepts: concepts,
        }),
      });
    }

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
    include: { client: true, concepts: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(payments);
}
