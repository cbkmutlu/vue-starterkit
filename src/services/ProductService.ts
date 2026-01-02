import { IBrand } from "./BrandService";
import { ICategory } from "./CategoryService";

export interface IProduct extends IDefaultFields {
   id: number;
   code: string;
   title: string;
   content?: string;
   is_active: number;
   sort_order: number;
   stock: number;
   price: number;
   date?: string;
   brand?: IBrand;
   category_list: ICategory[];
   image_list: { id: number; product_id: number; image_path: string }[];
}

export interface IProductStore {
   id?: number;
   code: string;
   title: string;
   content?: string;
   is_active: number;
   sort_order: number;
   stock: number;
   price: number;
   date?: string;
   brand_id?: number;
   product_category?: number[];
   image_path?: string[];
}

export const useGetProductAll = (query?: TQuery<IProduct[]>) => {
   const options: UseQueryOptions<IProduct[]> = {
      queryKey: ["product", "productAll"],
      queryFn: async ({ signal }) => {
         return (await appAxios.get("/product", { signal })).data;

         // await sleepDelay();
         // return (await appAxios.get("data/product.json", { signal })).data;
      },
      enabled: query?.enabled
   };

   return useQueryWrapper(options, query);
};

export const useGetProductById = (query?: TQuery<IProduct>) => {
   const options: UseQueryOptions<IProduct> = {
      queryKey: ["product", "productById", query?.params?.id, query?.params?.language],
      queryFn: async ({ signal }) => {
         return (await appAxios.get(`/product/${toValue(query?.params?.id)}`, { signal, params: { lang_id: toValue(query?.params?.language) } })).data;

         // await sleepDelay();
         // const result = (await appAxios.get("data/product.json", { signal })).data;
         // return {
         //    ...result,
         //    data: result.data.find((item: IProduct) => item.id === Number(toValue(query?.params?.id)))
         // };
      },
      enabled: query?.enabled
   };

   return useQueryWrapper(options, query);
};

export const useUpdateProduct = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationKey: ["product", "updateProduct"],
      mutationFn: async (payload: IProductStore): Promise<TResponse<IProduct>> => {
         return (await appAxios.put("/product", payload)).data;

         // await sleepDelay();
         // return { success: true, message: payload.id?.toString(), data: payload as IProduct, error: false, meta: null, status: 200 };
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
      mutationFn: async (payload: IProductStore): Promise<TResponse<IProduct>> => {
         return (await appAxios.post("/product", payload)).data;

         // await sleepDelay();
         // return { success: true, message: payload.id?.toString(), data: payload as IProduct, error: false, meta: null, status: 200 };
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
      mutationFn: async (payload: { product_id: number }): Promise<TResponse<boolean>> => {
         return (await appAxios.delete(`/product/${payload.product_id}`)).data;

         // await sleepDelay();
         // return { success: true, message: payload.id.toString(), data: true, error: false, meta: null, status: 200 };
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["product"] });
      }
   });
};

export const useUploadProductImage = () => {
   return useMutation({
      mutationKey: ["product", "uploadProductImage"],
      mutationFn: async (payload: { files: File[] }): Promise<TResponse<string[]>> => {
         return (await appAxios.postForm("/product/image", createFormData(payload))).data;
      }
   });
};

export const useDeleteProductImage = () => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationKey: ["product", "deleteProductImage"],
      mutationFn: async (payload: { image_id: number }): Promise<TResponse<boolean>> => {
         return (await appAxios.delete(`/product/image/${payload.image_id}`)).data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["product"] });
      }
   });
};
