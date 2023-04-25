import { router } from "./trpc";
import { z } from "zod";
import { userList } from "./routes/userList";
import { version } from "./routes/version";
import { translate } from "./routes/translate";
import { googleVerify } from "./routes/googleVerify";
import { me } from "./routes/me";
import { findRandomWord } from "./routes/findRandomWord";
import { defaultCourse } from "./routes/defaultCourse";
import { findCourses } from "./routes/findCourses";
import { availableSets } from "./routes/availableSets";
import { availableLanguages } from "./routes/availableLanguages";
import { newCourse } from "./routes/newCourse";
import { selectDefaultCourse } from "./routes/selectDefaultCourse";
import { createAnswer } from "./routes/createAnswer";
import { sentence } from "./routes/sentence";
import { generateImage } from "./routes/generateImage";

export * from "./context";

export const serverVariables = z.object({
  GOOGLE_CLIENT_EMAIL: z.string(),
  GOOGLE_PRIVATE_KEY: z.string(),
  DEEPL_API_KEY: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  OPENAI_API_KEY: z.string(),
  REPLICATE_API_TOKEN: z.string(),
  REDIS_URL: z.string(),
});

export const envVariables = z.object({
  GOOGLE_CLIENT_ID: z.string(),
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
  defaultCourse,
  findCourses,
  availableSets,
  availableLanguages,
  newCourse,
  selectDefaultCourse,
  createAnswer,
  sentence,
  generateImage
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
