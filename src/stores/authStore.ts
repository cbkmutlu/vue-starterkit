import { defineImmutableStore } from "@/plugins/pinia";
import { router } from "@/plugins/router";

export const useAuthStore = defineImmutableStore(
   "authStore",
   () => {
      const currentUser = ref("");
      const accessToken = ref("");
      const refreshToken = ref("");
      const returnUrl = ref("");

      const actions = {
         reset() {
            currentUser.value = "";
            accessToken.value = "";
            refreshToken.value = "";
            returnUrl.value = "";
         },
         userLogin(payload: { currentUser: string; accessToken: string; refreshToken: string }, redirect: boolean = true) {
            currentUser.value = payload.currentUser;
            accessToken.value = payload.accessToken;
            refreshToken.value = payload.refreshToken;
            redirect && router.push(returnUrl.value || "/");
         },
         userLogout(redirect: boolean = true) {
            this.reset();
            localStorage.removeItem(appConfig.key.auth);
            redirect && router.push("/login");
         },
         setUrl(value: string) {
            returnUrl.value = value;
         },
         updateTokens(payload: { accessToken: string; refreshToken?: string }) {
            accessToken.value = payload.accessToken;
            if (payload.refreshToken) {
               refreshToken.value = payload.refreshToken;
            }
         }
      };

      return {
         isAuthenticated: computed(() => currentUser.value !== ""),
         currentUser,
         accessToken,
         refreshToken,
         returnUrl,
         ...actions
      };
   },
   {
      persist: {
         key: appConfig.key.auth
      }
   }
);
