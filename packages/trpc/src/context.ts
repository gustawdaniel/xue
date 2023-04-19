import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { getUser } from "./getUser";
export function createContext({ req, res }: CreateFastifyContextOptions) {
  const user = getUser(req.headers.authorization);
  const auth = Boolean(user);
  return { req, res, user, auth };
}
export type Context = inferAsyncReturnType<typeof createContext>;
