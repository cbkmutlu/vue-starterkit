type TUpload = {
   files: File[];
   path?: string;
};

type TUnlinkWithPath = {
   path: string;
   id?: never;
   table?: never;
   field?: never;
   delete?: never;
};

type TUnlinkWithOutPath = {
   path?: never;
   id: number;
   table: string;
   field: string;
   delete?: boolean;
};

type TUnlink = TUnlinkWithPath | TUnlinkWithOutPath;

export const useUploadFile = () => {
   return useMutation({
      mutationKey: ["file", "uploadFile"],
      mutationFn: async (data: TUpload): Promise<TResponse<string[]>> => {
         const formData = createFormData({ files: data.files, path: data.path });
         // const formData = createFormData(data);

         return (await appAxios.postForm("/file/", formData)).data;
      }
   });
};

export const useUnlinkFile = (payload?: TMutation) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationKey: ["file", "unlinkFile"],
      mutationFn: async (data: TUnlink): Promise<TResponse<boolean>> => {
         return (await appAxios.patch("/file/", data)).data;
      },
      onSuccess: () => {
         if (payload?.invalidate) {
            queryClient.invalidateQueries({ queryKey: payload?.invalidate });
         }
      }
   });
};
