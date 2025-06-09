import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { numberToText } from "@/lib/numberToText";

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

    // Format amount for email
    const formattedAmount = new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "ARS",
    }).format(amount);

    const amountInWords = numberToText(amount);

    const today = new Date();

    // Send email receipt
    await resend.emails.send({
      from: "Digicom <noreply@redapuntes.com>",
      to: client.email,
      subject: "Recibo de Pago - Digicom",
      html: `
        <div style="width: 700px; margin: 0 auto; font-family: 'Courier New', monospace; border: 2px solid #000; padding: 20px;">
  <div style="text-align: center; margin-bottom: 10px;">
    <h2 style="margin: 0;">CLUB NAUTICO Y PESCA <span style="font-weight: normal;">Sociedad Civil</span></h2>
    <p style="margin: 10 0 0 0;">AVENIDA EL LIBANO 1757 - 4000</p>
      <p style="margin: 0;">SAN MIGUEL DE TUCUMÁN</p>
    <p style="margin: 0;">IVA EXENTO</p>
  </div>

  <div style="display: flex; justify-content: space-between; border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 10px 0; font-size: 14px; width: 100%;">
    <div style="flex: 1;"><strong>RECIBO N°:</strong> 0001-00000000</div>
    <div style="flex: 1; text-align: right;"><strong>FECHA:</strong> ${formattedDate}</div>
  </div>

  <table style="width: 100%; font-size: 14px; margin-top: 10px;">
    <tr>
      <td><strong>Señor:</strong> ${client.fullName}</td>
    </tr>
    <tr>
      <td><strong>Domicilio:</strong> ${client.street}</td>
    </tr>
    <tr>
      <td style="padding-top: 10px;"><strong>Recibí la suma de:</strong> ${amountInWords} (${formattedAmount})</td>
    </tr>
    <tr>
      <td><strong>En concepto de:</strong> ${concept}</td>
    </tr>
    <tr>
      <td style="padding-top: 10px;"><strong>Forma de pago:</strong> ${paymentType}</td>
    </tr>
  </table>

  <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 14px; width: 100%;">
    <div style="flex: 1;">
      <strong>Total:</strong> ${formattedAmount}
    </div>
    <div style="flex: 1; text-align: right;">
      <div style="border-top: 1px solid #000; width: 200px; margin-left: auto;"></div>
      <div style="margin-top: 5px;">Firma y Aclaración</div>
    </div>
  </div>

  <div style="margin-top: 30px; font-size: 12px; text-align: center;">
    Documento no válido como factura - Impresión: ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}
  </div>
</div>

      `,
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
