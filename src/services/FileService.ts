type TUpload = {
   files: File[];
};

type TUnlink = {
   path: string;
};

export const useUploadFile = () => {
   return useMutation({
      mutationKey: ["file", "uploadFile"],
      mutationFn: async (data: TUpload): Promise<TResponse<string[]>> => {
         const formData = createFormData(data);

         return (await appAxios.postForm("/file", formData)).data;
      }
   });
};

export const useUnlinkFile = (mutation?: TMutation) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationKey: ["file", "unlinkFile"],
      mutationFn: async (payload: TUnlink): Promise<TResponse<boolean>> => {
         return (await appAxios.patch("/file", payload)).data;
      },
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: mutation?.invalidate });
      }
   });
};

export const useProxyFile = (query?: TQuery<Blob>) => {
   const options: UseQueryOptions<string[]> = {
      queryKey: ["file", "proxyFile", query?.params?.path],
      queryFn: async ({ signal }) => {
         return await appAxios.get("/file", { signal, params: { path: toValue(query?.params?.path) }, responseType: "blob" });
      },
      enabled: query?.enabled
   };

   return useQueryWrapper(options, query);
};
