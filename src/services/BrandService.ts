export interface IBrand extends IDefaultFields {
   id: number;
   title: string;
   content?: string;
   is_active: number;
   sort_order: number;
}

export interface IBrandStore {
   id?: number;
   title: string;
   content?: string;
   is_active?: number;
   sort_order?: number;
}

export const useGetBrandAll = (query?: TQuery<IBrand[]>) => {
   const options: UseQueryOptions<IBrand[]> = {
      queryKey: ["brand", "brandAll"],
      queryFn: async ({ signal }) => {
         return (await appAxios.get("/brand/", { signal })).data;
      },
      enabled: query?.enabled
   };

   return useQueryWrapper(options, query);
};

export const useGetBrandById = (query?: TQuery<IBrand>) => {
   const options: UseQueryOptions<IBrand> = {
      queryKey: ["brand", "brandById", query?.params?.id],
      queryFn: async ({ signal }) => {
         return (await appAxios.get(`/brand/${toValue(query?.params?.id)}`, { signal })).data;
      },
      enabled: query?.enabled
   };

   return useQueryWrapper(options, query);
};

export const useCreateBrand = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationKey: ["brand", "createBrand"],
      mutationFn: async (payload: IBrandStore): Promise<TResponse<IBrand>> => {
         return (await appAxios.post("/brand/", payload)).data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["brand"] });
      }
   });
};

export const useUpdateBrand = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationKey: ["brand", "updateBrand"],
      mutationFn: async (payload: IBrandStore): Promise<TResponse<IBrand>> => {
         return (await appAxios.put("/brand/", payload)).data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["brand"] });
      }
   });
};

export const useDeleteBrand = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationKey: ["brand", "deleteBrand"],
      mutationFn: async (payload: { brand_id: number }): Promise<TResponse<boolean>> => {
         return (await appAxios.delete(`/brand/${payload.brand_id}`)).data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["brand"] });
      }
   });
};
