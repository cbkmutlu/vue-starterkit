// https://tanstack.com/query/latest/docs/framework/vue/reference/useQuery
// https://paulau.dev/blog/common-mistakes-in-tanstack-query-and-vuejs-composition-api/
// https://medium.com/@sukhobok.uliana/tanstack-vue-query-removed-onsuccess-and-onerror-callbacks-from-usequery-what-to-do-f76c5f11d724
export const options: VueQueryPluginOptions = {
   queryClientConfig: {
      defaultOptions: {
         queries: {
            refetchOnWindowFocus: appConfig.tanstack.refetch,
            gcTime: 1000 * 60 * appConfig.tanstack.cache, //minutes
            staleTime: 1000 * 60 * appConfig.tanstack.stale, //minutes
            retry: appConfig.retry.attempt,
            retryDelay: (attemptIndex) => attemptDelay(attemptIndex),
            select: (data: any) => data.data
         }
      }
   }
};

export const query = VueQueryPlugin;
