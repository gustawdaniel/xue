import { prisma } from "../src/storage/prisma";
import type { users, sets, Lang } from "database";
import { prepareWordsSetWithRanges } from "words-freq-sorter";
import fs from "fs";
import assert from "assert/strict";

async function setAdminUser(): Promise<users> {
  const email = "gustaw.daniel@gmail.com";
  const avatar =
    "https://lh3.googleusercontent.com/a/AGNmyxYmWYCdvfGMToQXCiYYcREzjPe65Vk_kqx8Bi8uXQ=s96-c";
  const name = "Daniel Gustaw";
  let user = await prisma.users.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    user = await prisma.users.create({
      data: {
        email,
        avatar,
        name,
        roles: ["admin"],
      },
    });
  }

  return user;
}

interface WordsSetData {
  code: string;
  name: string;
  icon: string;
  lang: Lang;
}

async function setWordsSet(
  setData: WordsSetData,
  user_id: string
): Promise<{ set: sets; isNew: boolean }> {
  let set = await prisma.sets.findFirst({
    where: {
      code: setData.code,
    },
  });
  // https://flagicons.lipis.dev/flags/4x3/es.svg
  if (!set) {
    set = await prisma.sets.create({
      data: {
        code: setData.code,
        name: setData.name,
        author_id: user_id,
        description:
          "https://storage.googleapis.com/books/ngrams/books/datasetsv2.html",
        lang: setData.lang,
        icon: setData.icon,
        tags: ["ngram", "google"],
        words_count: 0,
        freq_sum: 0,
      },
    });

    return {
      set,
      isNew: true,
    };
  } else {
    return {
      set,
      isNew: false,
    };
  }
}

async function setWordsFrequencies(set_id: string, wordsPayload: string) {
  const words = prepareWordsSetWithRanges(wordsPayload);

  words.every((rangedWord) =>
    assert.ok(
      Number.isFinite(rangedWord.freq),
      `Not finite ${rangedWord.freq} for word ${rangedWord.word} with range ${rangedWord.range}`
    )
  );

  await prisma.frequencies.createMany({
    data: words.map(({ word, freq, range }) => ({
      set_id,
      word,
      freq,
      range,
    })),
  });
  const words_count = words.length;
  const freq_sum = words.reduce((p, n) => p + n.freq, 0);
  await prisma.sets.update({
    where: { id: set_id },
    data: { words_count, freq_sum },
  });
}

function langCode(lang: Lang): string {
  return `${lang}-1-ngram-google-2012`;
}

function getSetsData(): Array<WordsSetData> {
  return [
    {
      code: langCode("de"),
      name: "German",
      icon: "https://flagcdn.com/de.svg",
      lang: "de",
    },
    {
      code: langCode("en"),
      name: "English",
      icon: "https://flagcdn.com/us.svg",
      lang: "en",
    },
    {
      code: langCode("es"),
      name: "Spanish",
      icon: "https://flagcdn.com/es.svg",
      lang: "es",
    },
    {
      code: langCode("fr"),
      name: "French",
      icon: "https://flagcdn.com/fr.svg",
      lang: "fr",
    },
    {
      code: langCode("ru"),
      name: "Russian",
      icon: "https://flagcdn.com/ru.svg",
      lang: "ru",
    },
  ];
}

async function setDefaultCourse(user: Pick<users, "id" | "default_course_id">) {
  if (!user.default_course_id) {
    const defaultCourse = await prisma.courses.create({
      data: {
        source_set: {
          connect: { code: langCode("en") },
        },
        target_lang: "pl",
        user: {
          connect: {
            id: user.id,
          },
        },
        iteration: 0,
      },
    });
    await prisma.users.update({
      where: { id: user.id },
      data: { default_course_id: defaultCourse.id },
    });
  }
}

async function main() {
  const user = await setAdminUser();

  const sets: Array<WordsSetData> = getSetsData();

  for (const setData of sets) {
    let { set, isNew } = await setWordsSet(setData, user.id);
    if (isNew) {
      const wordsPayload = fs
        .readFileSync(`${process.cwd()}/.cache/${setData.lang}.tsv`)
        .toString();
      await setWordsFrequencies(set.id, wordsPayload);
    }
  }

  await setDefaultCourse(user);
}

main().catch(console.error);
