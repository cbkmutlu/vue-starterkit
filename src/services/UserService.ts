export interface IUserAuth {
   user_id: string;
   user_email: string;
   access_token: string;
   refresh_token: string;
}

export const useLoginUser = () => {
   return useMutation({
      mutationKey: ["user", "loginUser"],
      mutationFn: async (payload: { email: string; password: string }): Promise<TResponse<IUserAuth>> => {
         return (await appAxios.post("/auth/login", payload)).data;
      }
   });
};

export const useLogoutUser = () => {
   return useMutation({
      mutationKey: ["user", "logoutUser"],
      mutationFn: async (payload: { token: string }): Promise<TResponse<void>> => {
         return (await appAxios.post("/auth/logout", payload)).data;
      }
   });
};
