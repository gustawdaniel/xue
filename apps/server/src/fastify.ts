import fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { appRouter } from "trpc";
import { createContext } from "./context";

export function getFastifyServer() :FastifyInstance {
  const app = fastify({
    maxParamLength: 5000
  });

  app.register(cors)

  app.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: { router: appRouter, createContext }
  });

  app.get("/", async () => {
    return { "status": "ok" };
  });

  return app
}
