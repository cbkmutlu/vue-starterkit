export interface ICategory extends IDefaultFields {
   id: number;
   code: string;
   title: string;
   content?: string;
   is_active: number;
   sort_order: number;
   image_path: string;
}

export interface ICategoryStore {
   id?: number;
   code: string;
   title: string;
   content?: string;
   is_active?: number;
   sort_order?: number;
   image_path?: string;
}

export const useGetCategoryAll = (payload?: TQuery<ICategory[]>) => {
   const options: UseQueryOptions<ICategory[]> = {
      queryKey: ["category", "categoryAll"],
      queryFn: async ({ signal }) => {
         // return (await appAxios.get("/category/", { signal })).data;

         // mock start
         await sleepDelay();
         return (await appAxios.get("http://localhost:5133/src/assets/data/category.json", { signal })).data;
         // mock end
      },
      enabled: payload?.enabled
   };

   return useQueryWrapper(options, payload);
};

export const useGetCategoryById = (payload?: TQuery<ICategory>) => {
   const options: UseQueryOptions<ICategory> = {
      queryKey: ["category", "categoryById", payload?.params?.id, payload?.params?.language],
      queryFn: async ({ signal }) => {
         // return (await appAxios.get(`/category/${toValue(payload?.params?.id)}`, { signal, params: { lang_id: toValue(payload?.params?.language) } })).data;

         // mock start
         await sleepDelay();
         const result = (await appAxios.get("http://localhost:5133/src/assets/data/category.json", { signal })).data;
         return {
            ...result,
            data: result.data.find((item: ICategory) => item.id === Number(toValue(payload?.params?.id)))
         };
         // mock end
      },
      enabled: payload?.enabled
   };

   return useQueryWrapper(options, payload);
};

export const useUpdateCategory = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationKey: ["category", "updateCategory"],
      mutationFn: async (data: ICategoryStore): Promise<TResponse<ICategory>> => {
         // return (await appAxios.put("/category/", data)).data;

         // mock start
         await sleepDelay();
         return { success: true, message: data.id?.toString(), data: data as ICategory, error: false, meta: null, status: 200 };
         // mock end
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["category"] });
         queryClient.invalidateQueries({ queryKey: ["product"] });
      }
   });
};

export const useCreateCategory = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationKey: ["category", "createCategory"],
      mutationFn: async (data: ICategoryStore): Promise<TResponse<ICategory>> => {
         // return (await appAxios.post("/category/", data)).data;

         // mock start
         await sleepDelay();
         return { success: true, message: data.id?.toString(), data: data as ICategory, error: false, meta: null, status: 200 };
         // mock end
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["category"] });
         queryClient.invalidateQueries({ queryKey: ["product"] });
      }
   });
};

export const useDeleteCategory = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationKey: ["category", "deleteCategory"],
      mutationFn: async (payload?: { id: number }): Promise<TResponse<boolean>> => {
         // return (await appAxios.delete(`/category/${payload?.id}`)).data;

         // mock start
         await sleepDelay();
         return { success: true, message: payload?.id.toString(), data: true, error: false, meta: null, status: 200 };
         // mock end
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["category"] });
         queryClient.invalidateQueries({ queryKey: ["product"] });
      }
   });
};
