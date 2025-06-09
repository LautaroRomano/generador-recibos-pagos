import { NextResponse } from "next/server";
import { Client } from "@/types";

import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email } = body;

    // Validate required fields
    if (!fullName || !email) {
      return NextResponse.json(
        { error: "Nombre completo y email son requeridos" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const clients = await prisma.client.findMany();
    if (clients.some((client: Client) => client.email === email)) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 409 }
      );
    }

    const newClient = await prisma.client.create({
      data: {
        fullName,
        email,
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
    }
  });
  return NextResponse.json(clients);
}
