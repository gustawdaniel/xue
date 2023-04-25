import { publicProcedure } from "../trpc";
import {Lang, langNames} from 'database'

export const availableLanguages = publicProcedure.query(() => {
  const keys = Object.keys(Lang) as Lang[];
  return keys.map((lang: Lang) => ({
    code: lang,
    name: langNames.get(lang) ?? lang
  }));
})
