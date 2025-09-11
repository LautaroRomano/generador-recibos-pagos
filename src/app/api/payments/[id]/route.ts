import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { numberToText } from "@/lib/numberToText";
import { EmailReceipt } from "@/components/EmailReceipt";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Validar ID
    if (!id) {
      return NextResponse.json(
        { error: "ID de pago requerido" },
        { status: 400 }
      );
    }

    // Buscar el pago por ID
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { client: true, concepts: true }, // Incluir los datos del cliente
    });

    // Verificar si el pago existe
    if (!payment) {
      return NextResponse.json(
        { error: "Pago no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error obteniendo pago:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { date, concepts, paymentType } = body;

    // Validar ID
    if (!id) {
      return NextResponse.json(
        { error: "ID de pago requerido" },
        { status: 400 }
      );
    }

    // Validar campos requeridos
    if (
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

    // Verificar si el pago existe
    const existingPayment = await prisma.payment.findUnique({
      where: { id },
      include: { client: true, concepts: true },
    });

    if (!existingPayment) {
      return NextResponse.json(
        { error: "Pago no encontrado" },
        { status: 404 }
      );
    }

    // Convert date string to ISO-8601 DateTime
    const isoDate = new Date(date).toISOString();

    // Calcular el monto total
    const totalAmount = concepts.reduce(
      (sum, concept) => sum + concept.amount,
      0
    );

    // Actualizar el pago y sus conceptos
    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: {
        date: isoDate,
        paymentType,
        amountText: numberToText(totalAmount),
        concepts: {
          deleteMany: {}, // Eliminar todos los conceptos existentes
          create: concepts.map((concept) => ({
            conceptType: concept.conceptType,
            amount: concept.amount,
            detail: concept.detail,
          })),
        },
      },
      include: {
        concepts: true,
        client: true,
      },
    });

    // Enviar email de corrección al cliente
    if (existingPayment.client?.email) {
      // Format date for email
      const formattedDate = new Date(isoDate).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      // Ensure client data exists and use defaults if not
      const clientName = existingPayment.client.fullName || "Cliente";
      const clientStreet = existingPayment.client.street || "Dirección no especificada";
      const clientLote = existingPayment.client.lote || undefined;
      const clientPhone = existingPayment.client.phone || undefined;

      // Send correction email
      await resend.emails.send({
        from: "Club Nautico y Pesca <noreply@digicom.net.ar>",
        to: existingPayment.client.email,
        subject: "Recibo de Pago Corregido - Club Nautico y Pesca",
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
          number: updatedPayment.number || 0,
          concepts: concepts,
        }),
      });
    }

    return NextResponse.json(updatedPayment, { status: 200 });
  } catch (error) {
    console.error("Error actualizando pago:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 