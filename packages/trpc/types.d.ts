// import fastify from "fastify";
import { serverVariables } from "trpc";
declare module "fastify" {
  export interface FastifyRequest {
    env: serverVariables;
  }
}
