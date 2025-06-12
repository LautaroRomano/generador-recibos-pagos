// prisma/seed.ts
import { prisma } from "@/lib/prisma";

async function main() {
  const client = await prisma.client.create({
    data: {
      fullName: 'Juan Díaz',
      email: 'juan.diaz@email.com',
    },
  });

  await prisma.payment.create({
    data: {
      clientId: client.id,
      date: new Date('2025-06-03'),
      amount: 89000,
      detail: 'Pago de expensa extraordinaria p/ Reorganización del Club',
      conceptType: 'Expensa extraordinaria',
    },
  });

  console.log('Datos cargados');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
