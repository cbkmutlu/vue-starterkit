export interface IProduct extends IDefaultFields {
   id: number;
   code: string;
   title: string;
   content?: string;
   price: number;
   currency: string;
   is_active: number;
   sort_order: number;
   category_list: { id: number; title: string }[];
   image_list: { id: number; product_id: number; image_path: string }[];
}

export interface IProductStore {
   id?: number;
   code: string;
   title: string;
   content?: string;
   price: number;
   currency?: string;
   is_active?: number;
   sort_order?: number;
   product_category?: number[];
   image_path?: string[];
}

export const useGetProductAll = (payload?: TQuery<IProduct[]>) => {
   const options: UseQueryOptions<IProduct[]> = {
      queryKey: ["product", "productAll"],
      queryFn: async ({ signal }) => {
         // return (await appAxios.get("/product/", { signal })).data;

         // mock start
         await sleepDelay();
         return (await appAxios.get("http://localhost:5133/src/assets/data/product.json", { signal })).data;
         // mock end
      },
      enabled: payload?.enabled
   };

   return useQueryWrapper(options, payload);
};

export const useGetProductById = (payload?: TQuery<IProduct>) => {
   const options: UseQueryOptions<IProduct> = {
      queryKey: ["product", "productById", payload?.params?.id, payload?.params?.language],
      queryFn: async ({ signal }) => {
         // return (await appAxios.get(`/product/${toValue(payload?.params?.id)}`, { signal, params: { lang_id: toValue(payload?.params?.language) } })).data;

         // mock start
         await sleepDelay();
         const result = (await appAxios.get("http://localhost:5133/src/assets/data/product.json", { signal })).data;
         return {
            ...result,
            data: result.data.find((item: IProduct) => item.id === Number(toValue(payload?.params?.id)))
         };
         // mock end
      },
      enabled: payload?.enabled
   };

   return useQueryWrapper(options, payload);
};

export const useUpdateProduct = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationKey: ["product", "updateProduct"],
      mutationFn: async (data: IProductStore): Promise<TResponse<IProduct>> => {
         // return (await appAxios.put("/product/", data)).data;

         // mock start
         await sleepDelay();
         return { success: true, message: data.id?.toString(), data: data as IProduct, error: false, meta: null, status: 200 };
         // mock end
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["product"] });
      }
   });
};

export const useCreateProduct = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationKey: ["product", "createProduct"],
      mutationFn: async (data: IProductStore): Promise<TResponse<IProduct>> => {
         // return (await appAxios.post("/product/", data)).data;

         // mock start
         await sleepDelay();
         return { success: true, message: data.id?.toString(), data: data as IProduct, error: false, meta: null, status: 200 };
         // mock end
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["product"] });
      }
   });
};

export const useDeleteProduct = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationKey: ["product", "deleteProduct"],
      mutationFn: async (payload?: { id: number }): Promise<TResponse<boolean>> => {
         // return (await appAxios.delete(`/product/${payload?.id}`)).data;

         // mock start
         await sleepDelay();
         return { success: true, message: payload?.id.toString(), data: true, error: false, meta: null, status: 200 };
         // mock end
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["product"] });
      }
   });
};
