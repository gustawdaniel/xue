import { publicProcedure } from "../trpc";
import {Lang} from 'database'

const langNames = new Map<Lang, string>([
  [Lang.de, 'German'],
  [Lang.pl, 'Polish'],
  [Lang.en, 'English'],
  [Lang.es, 'Spanish'],
  [Lang.fr, 'France'],
  [Lang.ru, 'Russian'],
  [Lang.uk, 'Ukrainian'],
])

export const availableLanguages = publicProcedure.query(() => {
  const keys = Object.keys(Lang) as Lang[];
  return keys.map((lang: Lang) => ({
    code: lang,
    name: langNames.get(lang) ?? lang
  }));
})
