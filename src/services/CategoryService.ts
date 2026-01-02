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
   translate: [{ language_id: number; title: string; content?: string }];
   is_active: number;
   sort_order: number;
   image_path?: string;
}

export const useGetCategoryAll = (query?: TQuery<ICategory[]>) => {
   const options: UseQueryOptions<ICategory[]> = {
      queryKey: ["category", "categoryAll"],
      queryFn: async ({ signal }) => {
         return (await appAxios.get("/category", { signal })).data;

         // await sleepDelay();
         // return (await appAxios.get("data/category.json", { signal })).data;
      },
      enabled: query?.enabled
   };

   return useQueryWrapper(options, query);
};

export const useGetCategoryById = (query?: TQuery<ICategory>) => {
   const options: UseQueryOptions<ICategory> = {
      queryKey: ["category", "categoryById", query?.params?.id, query?.params?.language],
      queryFn: async ({ signal }) => {
         return (await appAxios.get(`/category/${toValue(query?.params?.id)}`, { signal, params: { lang: toValue(query?.params?.language) } })).data;

         // await sleepDelay();
         // const result = (await appAxios.get("data/category.json", { signal })).data;
         // return {
         //    ...result,
         //    data: result.data.find((item: ICategory) => item.id === Number(toValue(query?.params?.id)))
         // };
      },
      enabled: query?.enabled
   };

   return useQueryWrapper(options, query);
};

export const useUpdateCategory = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationKey: ["category", "updateCategory"],
      mutationFn: async (payload: ICategoryStore): Promise<TResponse<ICategory>> => {
         return (await appAxios.put("/category", payload)).data;

         // await sleepDelay();
         // return { success: true, message: payload.id?.toString(), data: payload as ICategory, error: false, meta: null, status: 200 };
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
      mutationFn: async (payload: ICategoryStore): Promise<TResponse<ICategory>> => {
         return (await appAxios.post("/category", payload)).data;

         // await sleepDelay();
         // return { success: true, message: payload.id?.toString(), data: payload as ICategory, error: false, meta: null, status: 200 };
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
      mutationFn: async (payload: { category_id: number }): Promise<TResponse<boolean>> => {
         return (await appAxios.delete(`/category/${payload.category_id}`)).data;

         // await sleepDelay();
         // return { success: true, message: payload.id.toString(), data: true, error: false, meta: null, status: 200 };
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["category"] });
         queryClient.invalidateQueries({ queryKey: ["product"] });
      }
   });
};

export const useUploadCategoryImage = () => {
   return useMutation({
      mutationKey: ["category", "uploadCategoryImage"],
      mutationFn: async (payload: { files: File[] }): Promise<TResponse<string[]>> => {
         return (await appAxios.postForm("/category/image", createFormData(payload))).data;
      }
   });
};

export const useDeleteCategoryImage = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationKey: ["category", "deleteCategoryImage"],
      mutationFn: async (payload: { category_id: number }): Promise<TResponse<boolean>> => {
         return (await appAxios.delete(`/category/${payload.category_id}/image`)).data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["category"] });
      }
   });
};
