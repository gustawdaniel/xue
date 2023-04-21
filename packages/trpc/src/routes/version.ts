import packageJson from '../../package.json'
import { publicProcedure } from "../trpc";

export const version = publicProcedure.query(() => ({ version: packageJson.version }))
