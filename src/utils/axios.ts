// https://github.com/axios/axios/issues/5163
// https://dev.to/mperon/axios-error-handling-like-a-boss-333d
// appAxios.defaults.validateStatus = status => status >= 200 && status <= 400;
import { AxiosError, AxiosRequestConfig } from "axios";

declare module "axios" {
   export interface AxiosRequestConfig {
      _retry?: boolean;
      _attempt?: number;
   }
}

export const appAxios = axios.create({
   baseURL: import.meta.env.VITE_BASE,
   withCredentials: false,
   headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE",
      "Access-Control-Allow-Headers": "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With"
   }
});

appAxios.interceptors.request.use(
   async (config) => {
      const authStore = useAuthStore();
      const token = authStore.accessToken;
      if (token) {
         config.headers.Authorization = `Bearer ${token}`;
      }

      // localStorage
      // const langId = 1;
      // if (config.params) {
      //    config.params.lang_id = langId;
      // } else {
      //    config.params = { lang_id: langId };
      // }
      return config;
   },
   (error: AxiosError) => Promise.reject(error)
);

appAxios.interceptors.response.use(
   async (response) => {
      return response;
   },
   async (error: AxiosError) => Promise.reject(await errorHandler(error))
);

const authHandler = async (axiosConfig: AxiosRequestConfig): Promise<any> => {
   const authStore = useAuthStore();
   const refreshToken = authStore.refreshToken;

   axiosConfig._attempt = (axiosConfig._attempt || 0) + 1;
   const retryDelay = timerAttempt(axiosConfig._attempt - 1);

   if (!axiosConfig._retry && axiosConfig._attempt <= appConfig.retry.attempt) {
      axiosConfig._retry = true;

      return new Promise((resolve, reject) => {
         setTimeout(async () => {
            try {
               const response = await axios.post(`${import.meta.env.VITE_BASE}/api/v1/auth/refresh-token`, { refreshToken });
               authStore.updateTokens(response.data);
               resolve(appAxios(axiosConfig));
            } catch (error) {
               reject(authStore.userLogout());
            }
         }, retryDelay);
      });
   }

   return Promise.reject(new Error("Max retry attempts exceeded"));
};

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

const errorHandler = async (error: unknown): Promise<IResponse> => {
   const result = {
      code: 0,
      message: "Unknown Error",
      data: null
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
         result.code = response.status || Number(response.data.code) || Number(code) || 0;
         result.message = response.data.message || response.statusText;
         result.data = response.data;

         if (response.status === 401 && config) {
            return await authHandler(config);
         }
      } else if (request) {
         result.code = 0;
         result.message = "No response received from the server.";
      } else {
         result.code = Number(code) || 0;
         result.message = error.message || "Unknown Axios error";
      }
   } else if (error instanceof Error) {
      result.message = error.message;
   }

   return result;
};
