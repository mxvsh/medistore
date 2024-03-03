import prisma from '#/prisma';

export async function POST(req: Request) {
  const { name, price, quantity, category } = await req.json();

  const result = await prisma.product.create({
    data: {
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      category,
    },
  });

  return Response.json(result);
}

export async function GET(req: Request) {
  const result = await prisma.product.findMany();
  return Response.json(result);
}
