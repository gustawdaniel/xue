import fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { appRouter, createContext, serverVariables, envVariables } from "trpc";
import { z } from "zod";

export function getFastifyServer(
  env: z.infer<typeof serverVariables & typeof envVariables>
): FastifyInstance {
  const app = fastify({
    maxParamLength: 5000,
  });

  app.addHook("preHandler", async (req) => {
    req.env = process.env;
  });

  app.register(cors);

  app.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: { router: appRouter, createContext },
  });

  app.get("/", async () => {
    return { status: "ok" };
  });

  return app;
}
