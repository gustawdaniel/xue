import { protectedProcedure } from "../trpc";
import { z } from "zod";
import { Translator } from "translator";
import { CacheService } from "cache-service";
import { Lang, TranslationProvider, translations } from "database";
import { prisma } from "../storage/prisma";
import { RateLimiter } from "../services/RateLimiter";
import { TRPCError } from "@trpc/server";
import { writeInfluxLog } from "../storage/influx";

export const translate = protectedProcedure
  .input(
    z.object({
      from_text: z.string(),
      from_lang: z.nativeEnum(Lang),
      to_lang: z.nativeEnum(Lang),
      provider: z.nativeEnum(TranslationProvider),
    })
  )
  .query(
    async ({
      input,
      ctx,
    }): Promise<{
      from_text: string;
      from_lang: Lang;
      to_text: string;
      meanings: translations["meanings"];
      to_lang: Lang;
      provider: TranslationProvider;
    }> => {
      if(await RateLimiter.isLimited(ctx.user_id, 'translation')) {
        throw new TRPCError({code: 'TOO_MANY_REQUESTS'})
      }

      const existingTranslation = await prisma.translations.findUnique({
        where: {
          from_text_from_lang_to_lang_provider:input
        }
      });

      if(existingTranslation) return existingTranslation;

      const cacheService = new CacheService();

      const translator = new Translator({
        google: {
          client_email: ctx.env.GOOGLE_CLIENT_EMAIL,
          private_key: ctx.env.GOOGLE_PRIVATE_KEY,
        },
        deepl: {
          apiKey: ctx.env.DEEPL_API_KEY,
        },
        cacheService,
      });

      const translation = await translator.translateWithProvider(
        input.from_text,
        input.from_lang,
        input.to_lang,
        input.provider
      );

      if(cacheService.cacheMissed()) {
        await RateLimiter.setUsage(ctx.user_id, 'translation');
        writeInfluxLog(ctx.user_id, "translation", cacheService.timeUsedNanoSeconds, [input.provider])
      }

      await prisma.translations.create({
        data: {
          from_lang: input.from_lang,
          from_text: input.from_text,
          to_lang: input.to_lang,
          to_text: translation.to_text,
          meanings: translation.meanings,
          provider: input.provider
        }
      });

      return {
        from_text: input.from_text,
        from_lang: input.from_lang,
        to_text: translation.to_text,
        meanings: translation.meanings,
        to_lang: input.to_lang,
        provider: input.provider,
      };
    }
  );
