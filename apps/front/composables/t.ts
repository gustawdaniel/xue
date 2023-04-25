import { AppRouter } from "trpc";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { useToken } from "~/composables/token";
import superjson from 'superjson';

export const t = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: "http://localhost:2022/trpc",
      headers: () => {
        const headers: Map<string, string> = new Map<string, string>();

        const token = useToken() as {value: string};

        console.log("token", token.value);

        if (token.value) {
          headers.set("Authorization", `Bearer ${token.value}`);
        }

        return Object.fromEntries(headers);
      },
    }),
  ],
});

// import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
//
// type RouterInput = inferRouterInputs<AppRouter>;
// type RouterOutput = inferRouterOutputs<AppRouter>;
