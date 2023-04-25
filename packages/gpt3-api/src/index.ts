import { backoff, Gpt3Message } from "./backoff";
import { CacheService } from "cache-service";

export type GptSimpleResponse = {
  id: string,
  message: {
    content: string,
    'role': 'assistant' | 'user' | 'system',
  },
  finish_reason: string
}

export interface GptSimpleParams {
  prompt: string,
  model: string,
}

interface GPT3Config {
  apiKey: string;
  cacheService?: CacheService;
}

export class GPT3 {
  private readonly apiKey: string;
  private readonly cacheService: Pick<CacheService, "wrap"> = {
    wrap: CacheService.noWrap,
  };

  constructor(config: GPT3Config) {
    this.apiKey = config.apiKey;
    if (config.cacheService) {
      this.cacheService = config.cacheService;
    }
  }

  async ask(messages: Gpt3Message[], model: 'gpt-3.5-turbo' = 'gpt-3.5-turbo'): Promise<GptSimpleResponse> {

    return await this.cacheService.wrap<GptSimpleResponse>(
      async () => {
        const {data} = await backoff(this.apiKey, messages, model);
        console.log("response", data);

        if (!data.choices.length) {
          throw new Error(`No choices in GPT answer`);
        }

        return {
          id: data.id,
          message: data.choices[0].message, finish_reason: data.choices[0].finish_reason ?? ''
        }
      },
      { type: "sentence", messages: messages, provider: model },
      ["openai"]
    );
  }
}


