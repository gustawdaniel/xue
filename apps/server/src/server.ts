import { getFastifyServer } from "./fastify";

async function main(){
  const app = getFastifyServer()

  try {
    await app.listen({ port: 2022 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

main().catch(console.error)
