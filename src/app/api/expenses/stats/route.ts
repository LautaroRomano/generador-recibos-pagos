import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

// GET /api/expenses/stats - Obtener estadísticas de gastos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const period = searchParams.get("period"); // weekly, monthly, yearly

    let where: any = {};
    let groupBy: any = {};

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate),
      };
    } else {
      // Si no se especifican fechas, usar el período
      const now = new Date();
      let start: Date;
      let end: Date = now;

      switch (period) {
        case "weekly":
          start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "monthly":
          start = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case "yearly":
          start = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          start = new Date(now.getFullYear(), now.getMonth(), 1);
      }

      where.date = {
        gte: start,
        lte: end,
      };
    }

    // Obtener total de gastos
    const totalExpenses = await prisma.expense.aggregate({
      where,
      _sum: {
        amount: true,
      },
      _count: true,
    });

    // Obtener gastos por categoría
    const expensesByCategory = await prisma.expense.groupBy({
      by: ["category"],
      where,
      _sum: {
        amount: true,
      },
      _count: true,
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
    });

    // Obtener gastos por día para gráficos
    const expensesByDay = await prisma.expense.groupBy({
      by: ["date"],
      where,
      _sum: {
        amount: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    // Obtener categorías únicas
    const categories = await prisma.expense.findMany({
      where,
      select: {
        category: true,
      },
      distinct: ["category"],
    });

    return NextResponse.json({
      total: totalExpenses._sum.amount || 0,
      count: totalExpenses._count || 0,
      byCategory: expensesByCategory,
      byDay: expensesByDay,
      categories: categories.map(c => c.category),
    });
  } catch (error) {
    console.error("Error fetching expense stats:", error);
    return NextResponse.json(
      { error: "Error al obtener las estadísticas" },
      { status: 500 }
    );
  }
}
