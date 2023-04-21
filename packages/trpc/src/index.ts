import { router } from "./trpc";
import { z } from "zod";
import { userList } from "./routes/userList";
import { version } from "./routes/version";
import { googleVerify } from "./routes/googleVerify";
import { me } from "./routes/me";
import { findRandomWord } from "./routes/findRandomWord";
import { translate } from "./routes/translate";

export * from "./context";

const envVariables = z.object({
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  JWT_SECRET_KEY: z.string()
});

envVariables.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {
    }
  }
}

export const appRouter = router({
  userList,
  version,
  googleVerify,
  me,
  findRandomWord,
  translate,
});



// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
