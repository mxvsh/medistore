import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '#/server/api/trpc';

export const product = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.product.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
        category: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db.product.create({
        data: {
          name: input.name,
          price: input.price,
          quantity: input.quantity,
          category: input.category,
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
        category: z.string(),
      }),
    )
    .mutation(({ input, ctx }) => {
      return ctx.db.product.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          price: input.price,
          quantity: input.quantity,
          category: input.category,
        },
      });
    }),
});
