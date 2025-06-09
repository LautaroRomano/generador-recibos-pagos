import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { fullName, email, street, lote, phone } = body;
    const { id } = params;

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

    // Check if client exists
    const existingClient = await prisma.client.findUnique({
      where: { id },
    });

    if (!existingClient) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    // Check if email is already taken by another client
    if (email !== existingClient.email) {
      const emailExists = await prisma.client.findFirst({
        where: {
          email,
          id: { not: id },
        },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "El email ya está registrado" },
          { status: 409 }
        );
      }
    }

    // Update client
    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        fullName,
        email,
        street,
        lote,
        phone,
      },
    });

    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 