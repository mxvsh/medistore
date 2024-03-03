import { initTRPC } from '@trpc/server';
import prisma from '#/prisma';

export const createTRPCContext = async (opts: { headers: Headers }) => {
  return {
    db: prisma,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
