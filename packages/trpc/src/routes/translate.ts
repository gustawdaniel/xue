import { protectedProcedure } from "../trpc";
import { z } from "zod";
import { Lang, TranslationProvider } from "database";
import { Translator } from "translator";

export const translate = protectedProcedure.input(z.object({
  from_text: z.string(),
  from_lang: z.nativeEnum(Lang),
  to_lang: z.nativeEnum(Lang),
  provider: z.nativeEnum(TranslationProvider)
})).query(async ({ input }) => {
  const translator = new Translator({
    google: {
      // client_email
    }
  });

  const translations = await translator.translateWithProvider(input.from_text, input.from_lang, input.to_lang, input.provider);

  return {
    from_text: input.from_text,
    from_lang: input.from_lang,
    to_text: translations.map((translation) => translation.word).find(() => true) ?? '',
    to_lang: input.to_lang,
    provider: input.provider
  }

});
