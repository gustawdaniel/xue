// // import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
//
// import type { AppRouter } from 'trpc';
// import { useToken } from "#imports";
//
// export default defineNuxtPlugin((nuxtApp) => {
//   const client
//     = createTRPCNuxtClient<AppRouter>({
//     links: [
//       httpBatchLink({
//         url: 'http://localhost:2022/trpc',
//         headers: () => {
//           const headers: Map<string, string> = new Map<string, string>();
//
//           const token = useToken();
//
//           console.log("token", token.value);
//
//           if (token.value) {
//             headers.set('Authorization', `Bearer ${token.value}`);
//           }
//
//           return Object.fromEntries(headers);
//         }
//       }),
//     ],
//   });
//
//   return {
//     provide: {
//       client,
//     },
//   }
// })
