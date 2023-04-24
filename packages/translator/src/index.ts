import axios from "axios";
import qs from "qs";
import {
  translations,
  Lang,
  TranslationProvider,
} from "database";
import { v2 } from "@google-cloud/translate";
import { getRandom } from "random-useragent";
import { CredentialBody } from "google-auth-library/build/src/auth/credentials";
import { CacheService } from "cache-service";
import { Reverso, ReversoLang } from "./Reverso";

type TranslationWitchProviders = {
  lang: Lang;
  word: string;
  providers: TranslationProvider[];
};

export class Translation {
  lang!: Lang;
  word!: string;
}

export class StrictWordsWhereInput {
  word!: string;
  source!: Lang;
  target!: Lang;
}

export const providers = ["deepl", "reverso", "google"];

export class FullTranslationResponse {
  provider!: TranslationProvider;
  translations!: Pick<translations, "to_text" | "meanings">;
}

const DEEPL_URL = "https://api-free.deepl.com/v2/translate";
const REVERSO_URL = "https://api.reverso.net/translate/v1/translation";
const GOOGLE_URL = "https://translation.googleapis.com/language/translate/v2";



type CorrectDeeplResponse = {
  translations: Array<{
    detected_source_language: "EN";
    text: "wilk";
  }>;
};

type CorrectReversoResponse = {
  id: string; // '59ef20b5-01b7-4e2c-972a-e8767c8026bf',
  from: ReversoLang; // 'pol',
  to: ReversoLang;
  input: string[]; // ['woda'],
  correctedText: null;
  translation: string[]; // ['water'],
  engines: ["Context"];
  languageDetection: {
    detectedLanguage: ReversoLang; // 'pol',
    isDirectionChanged: boolean; // false,
    originalDirection: string; // 'pol-eng',
    originalDirectionContextMatches: number; // 28057,
    changedDirectionContextMatches: number; // 0,
    timeTaken: number; // 253
  };
  contextResults: {
    rudeWords: boolean; // false,
    colloquialisms: boolean; // false,
    riskyWords: boolean; // false,
    results: {
      translation: string; // 'water',
      sourceExamples: string[]; // 'Dodatkowo ozonowana <em>woda</em> smakuje zwierzętom bardziej.',
      targetExamples: string[]; // 'In addition, ozonized <em>water</em> tastes more good to the animals.',
      rude: boolean; // false,
      colloquial: boolean; // false,
      partOfSpeech: string; // 'n.',
      frequency: number; // 25713,
      vowels: null;
      transliteration: null;
    }[];
    totalContextCallsMade: number; // 1,
    timeTakenContext: number; // 0
  };
  truncated: boolean; // false,
  timeTaken: number; // 253
};

interface TranslatorConfig {
  deepl?: {
    apiKey: string;
  };
  google?: CredentialBody;
  cacheService?: CacheService;
}

export class Translator {
  private readonly deeplConfig: TranslatorConfig["deepl"];
  private readonly googleConfig: TranslatorConfig["google"];
  private readonly cacheService: Pick<CacheService, "wrap"> = {
    wrap: CacheService.noWrap,
  };

  constructor(config?: TranslatorConfig) {
    if (config) {
      this.deeplConfig = config.deepl;
      this.googleConfig = config.google;
      if (config.cacheService) {
        this.cacheService = config.cacheService;
      }
    }
  }

  private async google(
    word: string,
    source: Lang,
    target: Lang
  ): Promise<Pick<translations, "to_text" | "meanings">> {
    if (!this.googleConfig?.client_email || !this.googleConfig.private_key) {
      throw new Error(`No google credentials`);
    }

    // const key = CacheService.httpToKey({
    //   url: GOOGLE_URL, method: "POST", body: { q: word, source, target, format: "text" }
    // });

    const [res, _details] = await this.cacheService.wrap<[string, any]>(
      async () => {
        const client = new v2.Translate({
          credentials: this.googleConfig,
        });

        return await client.translate(word, target);
      },
      { type: "translation", word, source, target, provider: "google" },
      ["google"]
    );

    return {
      to_text: res,
      meanings: [
        {
          to_text: res,
          pos: "other",
          sentences: [],
        },
      ],
    };
  }

  private async deepl(
    word: string,
    source: Lang,
    target: Lang
  ): Promise<Pick<translations, "to_text" | "meanings">> {
    if (!this.deeplConfig?.apiKey) {
      throw new Error(`No deepl api key`);
    }

    // const key = CacheService.httpToKey({
    //   url: DEEPL_URL, method: "POST", body: { text: word, target_lang: target.toUpperCase() }
    // });

    // TODO: fix any
    const data = await this.cacheService.wrap<CorrectDeeplResponse>(
      async () => {
        const { data } = await axios.post<CorrectDeeplResponse>(
          DEEPL_URL,
          qs.stringify({
            auth_key: this.deeplConfig?.apiKey,
            text: word,
            target_lang: target.toUpperCase(),
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        return data;
      },
      { type: "translation", word, source, target, provider: "deepl" },
      ["deepl"]
    );

    return {
      to_text: data.translations.map((t) => t.text).find(() => true) ?? "",
      meanings: data.translations.map(
        (trans: { detected_source_language: string; text: string }) => ({
          to_text: trans.text,
          pos: "other",
          sentences: [],
        })
      ),
    };
  }

  // {
  //     text: 'навчальний',
  //         from: 'ukrainian',
  //     to: 'english',
  //     translation: [ 'educational' ],
  //     context: null,
  //     detected_language: 'ukr',
  //     voice: 'https://voice.reverso.net/RestPronunciation.svc/v1/output=json/GetVoiceStream/voiceName=Heather22k?inputText=ZWR1Y2F0aW9uYWw='
  // }
  private async reverso(
    word: string,
    source: Lang,
    target: Lang
  ): Promise<Pick<translations, "to_text" | "meanings">> {
    const languages = Reverso.languages;

    // const key = CacheService.httpToKey({
    //   url: REVERSO_URL, method: "POST", body: { from: languages[source], input: word, to: languages[target] }
    // });

    const data = await this.cacheService.wrap<CorrectReversoResponse>(
      async () => {
        const { data } = await axios.request<CorrectReversoResponse>({
          method: "POST",
          url: REVERSO_URL,
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
            Connection: "keep-alive",
            "User-Agent": getRandom(),
          },
          data: {
            format: "text",
            from: languages.get(source),
            input: word,
            options: {
              contextResults: true,
              languageDetection: true,
              origin: "reversomobile",
              sentenceSplitter: false,
            },
            to: languages.get(target),
          },
        });

        return data;
      },
      { type: "translation", word, source, target, provider: "reverso" },
      ["reverso"]
    );


    return {
      to_text: data.translation.find(() => true) ?? "",
      meanings: data.contextResults.results.map((res) => ({
        to_text: res.translation,
        pos: Reverso.getPartOfSpeech(res.partOfSpeech),
        sentences: res.sourceExamples.map((s, i) => ({
          from_lang: source,
          from_text: res.targetExamples[i],
          to_lang: target,
          to_text: s,
        })),
      })),
    };
  }

  async translateWithProvider(
    word: string,
    source: Lang,
    target: Lang,
    provider: TranslationProvider
  ): Promise<Pick<translations, "to_text" | "meanings">> {
    try {
      switch (provider) {
        case "deepl":
          return this.deepl(word, source, target);
        case "reverso":
          return this.reverso(word, source, target);
        case "google":
          return this.google(word, source, target);
        default:
          return { to_text: "", meanings: [] };
      }
    } catch (e) {
      console.error(`Fail for ${word} in ${target}`);
      console.error(e);
      return { to_text: "", meanings: [] };
    }
  }

  async translateWithAllProviders(
    where: StrictWordsWhereInput
  ): Promise<FullTranslationResponse[]> {
    const providers: TranslationProvider[] = [
      "reverso" as TranslationProvider,
      "deepl" as TranslationProvider,
      "google" as TranslationProvider,
    ];

    return Promise.all(
      providers.map(async (provider): Promise<FullTranslationResponse> => {
        const translations = await this.translateWithProvider(
          where.word,
          where.source,
          where.target,
          provider
        );
        return {
          provider,
          translations,
        };
      })
    );
  }

  async translate(
    where: StrictWordsWhereInput
  ): Promise<TranslationWitchProviders[]> {
    const translations = await this.translateWithAllProviders(where);
    return translations.reduce((p: TranslationWitchProviders[], n) => {
      n.translations.meanings.forEach((meaning) => {
        const index = p.findIndex((et) => et.word === meaning.to_text);
        if (index >= 0) {
          p[index].providers.push(n.provider);
        } else {
          p.push({
            word: meaning.to_text,
            lang: where.target,
            providers: [n.provider],
          });
        }
      });
      return p;
    }, []);
  }
}
