import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET /api/expenses/[id] - Obtener un gasto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const expenses = await prisma.expense.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    const number = expenses.findIndex((expense) => expense.id === id) + 1;
    const expense = expenses.find((expense) => expense.id === id);


    if (!expense) {
      return NextResponse.json(
        { error: "Gasto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ ...expense, number });
  } catch (error) {
    console.error("Error fetching expense:", error);
    return NextResponse.json(
      { error: "Error al obtener el gasto" },
      { status: 500 }
    );
  }
}

// PUT /api/expenses/[id] - Actualizar un gasto
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { description, amount, category, date, receiptUrl, notes } = body;

    if (!description || !amount || !category || !date) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        description,
        amount: parseFloat(amount),
        category,
        date: new Date(date),
        receiptUrl,
        notes,
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { error: "Error al actualizar el gasto" },
      { status: 500 }
    );
  }
}

// DELETE /api/expenses/[id] - Eliminar un gasto
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.expense.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Gasto eliminado correctamente" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Error al eliminar el gasto" },
      { status: 500 }
    );
  }
}
