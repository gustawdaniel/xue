import { inferAsyncReturnType } from "@trpc/server";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { getUser } from "./getUser";

export function createContext({ req }: CreateFastifyContextOptions) {
  const user = getUser(req.headers.authorization);
  const auth = Boolean(user);
  const user_id = auth ? user?.sub ?? "" : "";
  return { user, auth, user_id };
}

export type Context = inferAsyncReturnType<typeof createContext>;
