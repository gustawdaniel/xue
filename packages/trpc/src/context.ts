import { inferAsyncReturnType } from "@trpc/server";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { getUser } from "./getUser";
import { z } from "zod";
import { envVariables, serverVariables } from "./index";

// export function createContext(env: z.infer<typeof serverVariables & typeof envVariables>) {
//   return ({ req }: CreateFastifyContextOptions) => {
//     const user = getUser(req.headers.authorization);
//     const auth = Boolean(user);
//     const user_id = auth ? user?.sub ?? "" : "";
//     return { user, auth, user_id, env };
//   };
// }

export function createContext({ req }: CreateFastifyContextOptions) {
  const user = getUser(req.headers.authorization);
  const auth = Boolean(user);
  const user_id = auth ? user?.sub ?? "" : "";
  return {
    user,
    auth,
    user_id,
    env: req.env,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
