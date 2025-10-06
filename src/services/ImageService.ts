interface IUpload {
   files: File[];
   path: string;
}

interface IDelete {
   id: number;
   table: string;
   unlink?: boolean;
   delete?: boolean;
}

export const useUploadImage = () => {
   return useMutation({
      mutationKey: ["image", "uploadImage"],
      mutationFn: async (data: IUpload): Promise<TResponse<string[]>> => {
         const formData = createFormData({ files: data.files, path: data.path });
         // const formData = createFormData(data);

         return (await appAxios.postForm("/image/create", formData)).data;
      }
   });
};

export const useDeleteImage = (payload?: TMutation) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationKey: ["image", "deleteImage"],
      mutationFn: async (data: IDelete): Promise<TResponse<boolean>> => {
         return (await appAxios.post("/image/delete", data)).data;
      },
      onSuccess: () => {
         if (payload?.invalidate) {
            queryClient.invalidateQueries({ queryKey: payload?.invalidate });
         }
      }
   });
};
