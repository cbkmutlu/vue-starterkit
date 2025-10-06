// https://dev.to/mperon/axios-error-handling-like-a-boss-333d
import { AxiosError, AxiosRequestConfig } from "axios";

declare module "axios" {
   interface AxiosRequestConfig {
      _retry?: boolean;
      _attempt?: number;
   }
}

export type TResponse<T = any> = {
   success: boolean;
   message?: string;
   data: T;
   error: any;
   meta: any;
   status: number;
};

export const appAxios = axios.create({
   baseURL: import.meta.env.VITE_BASE,
   withCredentials: false,
   headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
   },
   validateStatus: (status) => status >= 200 && status <= 300
});

appAxios.interceptors.request.use(
   async (config) => {
      const authStore = useAuthStore();
      const token = authStore.accessToken;
      if (token) {
         config.headers["Authorization"] = `Bearer ${token}`;
      }

      // COMBAK
      // const appLang = localStorage.getItem(appConfig.key.locale);
      // const langId = ELanguage[appLang as keyof typeof ELanguage] || ELanguage["tr-TR"];
      // if (config.params) {
      //    config.params.lang_id = langId;
      // } else {
      //    config.params = { lang_id: langId };
      // }
      return config;
   },
   async (error: AxiosError) => {
      return Promise.reject(error);
   }
);

appAxios.interceptors.response.use(
   async (response) => {
      return response;
   },
   async (error: AxiosError) => {
      return Promise.reject(await errorHandler(error));
   }
);

const authHandler = async (axiosConfig: AxiosRequestConfig): Promise<any> => {
   const authStore = useAuthStore();
   const refreshToken = authStore.refreshToken;

   axiosConfig._attempt = (axiosConfig._attempt || 0) + 1;
   const retryDelay = attemptDelay(axiosConfig._attempt - 1);

   if (!axiosConfig._retry && axiosConfig._attempt <= appConfig.retry.attempt) {
      axiosConfig._retry = true;

      return new Promise((resolve, reject) => {
         setTimeout(async () => {
            try {
               const response = await axios.post(`${import.meta.env.VITE_BASE}/api/v1/auth/refresh-token`, { refreshToken });
               authStore.updateTokens(response.data);
               resolve(appAxios(axiosConfig));
            } catch {
               reject(authStore.userLogout());
            }
         }, retryDelay);
      });
   }

   return Promise.reject(new Error("Max retry attempts exceeded"));
};

// COMBAK
// const authHandler = async (config: AxiosRequestConfig): Promise<any> => {
//    const authStore = useAuthStore();
//    const refreshToken = authStore.refreshToken;

//    config._attempt = (config._attempt || 0) + 1;

//    if (!config._retry && config._attempt <= import.meta.env.VITE_RETRY_ATTEMPT) {
//       config._retry = true;

//       await new Promise(resolve => setTimeout(resolve, delay));
//       return await axios
//          .post(`${import.meta.env.VITE_BASE}/api/v1/auth/refresh-token`, { refreshToken })
//          .then((response) => {
//             authStore.updateTokens(response.data);
//             return appAxios(config);
//          })
//          .catch(() => authStore.userLogout());
//    }
// };

const errorHandler = async (error: unknown): Promise<TResponse> => {
   const result: TResponse = {
      success: false,
      message: "Unknown Error",
      data: null,
      error: true,
      meta: null,
      status: 0
   };

   if (!error) {
      return result;
   }

   if (axios.isAxiosError(error)) {
      const response = error.response;
      const request = error.request;
      const config = error.config;
      const code = error.code || 0;

      if (response) {
         result.status = response.status || Number(response.data.code) || Number(code) || 0;
         result.message = response.data.message || response.statusText;
         result.error = response.data.error;

         if (response.status === 401 && config) {
            return await authHandler(config);
         }
      } else if (request) {
         result.status = Number(code) || 0;
         result.message = "No response received from the server.";
         result.error = code;
      } else {
         result.status = Number(code) || 0;
         result.message = error.message || "Unknown Axios error";
         result.error = code;
      }
   } else if (error instanceof Error) {
      result.message = error.message;
   }

   return result;
};
