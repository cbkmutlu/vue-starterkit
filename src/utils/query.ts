// https://tanstack.com/query/latest/docs/framework/vue/reference/useQuery
// https://paulau.dev/blog/common-mistakes-in-tanstack-query-and-vuejs-composition-api/
// https://medium.com/@sukhobok.uliana/tanstack-vue-query-removed-onsuccess-and-onerror-callbacks-from-usequery-what-to-do-f76c5f11d724

export type TParams = {
   id?: MaybeRef<string | string[] | number>;
   language?: MaybeRef<string | number>;
   page?: MaybeRef<string | number>;
   query?: MaybeRef<string>;
   sort?: MaybeRef<string>;
   order?: MaybeRef<string>;
   filter?: MaybeRef<string>;
   limit?: MaybeRef<string | number>;
   status?: MaybeRef<string | number>;
   start_date?: MaybeRef<Date>;
   end_date?: MaybeRef<Date>;
};

export type TQuery<T> = {
   onSuccess?: (data: T) => void;
   onError?: (error: any) => void;
   enabled?: Ref<boolean>;
   params?: TParams;
};

export type TMutation = {
   invalidate?: string[];
};

export const queryOptions: VueQueryPluginOptions = {
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
