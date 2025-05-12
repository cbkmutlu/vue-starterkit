// https://tanstack.com/query/latest/docs/framework/vue/reference/useQuery
export const queryOptions: VueQueryPluginOptions = {
   queryClientConfig: {
      defaultOptions: {
         queries: {
            refetchOnWindowFocus: appConfig.tanstack.refetch,
            gcTime: 1000 * 60 * appConfig.tanstack.cache, //minutes
            staleTime: 1000 * 60 * appConfig.tanstack.stale, //minutes
            retry: appConfig.retry.attempt,
            retryDelay: (attemptIndex) => timerAttempt(attemptIndex)
         }
      }
   }
};

export const query = VueQueryPlugin;
