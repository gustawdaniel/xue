import { getFastifyServer } from "./fastify";
import { z } from "zod";
import { serverVariables } from "trpc";

serverVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof serverVariables> {}
  }
}

async function main() {
  const app = getFastifyServer(process.env);

  try {
    await app.listen({ port: 2022 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main().catch(console.error);
