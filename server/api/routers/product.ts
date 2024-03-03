import { z } from 'zod';

import { createTRPCRouter, publicProcedure } from '#/server/api/trpc';

export const product = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) => {
    return ctx.db.product.findMany();
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
});
