import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, street, lote, phone } = body;

    // Validate required fields
    if (!fullName) {
      return NextResponse.json(
        { error: "Nombre completo es requerido" },
        { status: 400 }
      );
    }

    const newClient = await prisma.client.create({
      data: {
        fullName,
        email: email || null,
        street,
        lote,
        phone,
      },
    });

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve all clients
export async function GET() {
  const clients = await prisma.client.findMany({
    orderBy: {
      fullName: "asc",
    },
    include: {
      payments: {
        orderBy: {
          date: "desc",
        },
        take: 1,
      },
    },
  });

  // Transform the data to include lastPaymentDate
  const clientsWithLastPayment = clients.map((client: any) => ({
    ...client,
    lastPaymentDate: client.payments?.[0]?.date || null,
    payments: undefined, // Remove the payments array from the response
  }));

  return NextResponse.json(clientsWithLastPayment);
}
