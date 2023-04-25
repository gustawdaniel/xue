import {Lang} from "@prisma/client";

export * from "@prisma/client";

export const langNames = new Map<Lang, string>([
  [Lang.de, 'German'],
  [Lang.pl, 'Polish'],
  [Lang.en, 'English'],
  [Lang.es, 'Spanish'],
  [Lang.fr, 'France'],
  [Lang.ru, 'Russian'],
  [Lang.uk, 'Ukrainian'],
])
