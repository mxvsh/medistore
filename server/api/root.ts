import { createTRPCRouter } from '#/server/api/trpc';
import * as routes from '#/server/api/routers';

export const appRouter = createTRPCRouter(routes);

export type AppRouter = typeof appRouter;
