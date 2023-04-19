import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

import type { AppRouter } from 'trpc';

export default defineNuxtPlugin((nuxtApp) => {
  const client
    = createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: 'http://localhost:2022/trpc',
      }),
    ],
  });

  return {
    provide: {
      client,
    },
  }
})
