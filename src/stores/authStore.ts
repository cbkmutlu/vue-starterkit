import { router } from "@/plugins/router";

export const useAuthStore = defineStore(
   "authStore",
   () => {
      const currentUser: Ref<string | null> = ref(null);
      const accessToken: Ref<string | null> = ref(null);
      const refreshToken: Ref<string | null> = ref(null);
      const returnUrl: Ref<string | null> = ref(null);

      const actions = {
         reset() {
            currentUser.value = null;
            accessToken.value = null;
            refreshToken.value = null;
            returnUrl.value = null;
         },
         userLogin(payload: { [key: string]: string }, redirect: boolean = true) {
            currentUser.value = payload.currentUser;
            accessToken.value = payload.accessToken;
            refreshToken.value = payload.refreshToken;
            redirect && router.push(returnUrl.value || "/");
         },
         userLogout(redirect: boolean = true) {
            this.reset();
            redirect && router.push("/login");
         },
         setUrl(value: string) {
            returnUrl.value = value;
         },
         updateTokens(payload: { [key: string]: any }) {
            accessToken.value = payload.accessToken;
            refreshToken.value = payload.refreshToken;
         }
      };

      return {
         currentUser: computed(() => currentUser.value),
         accessToken: computed(() => accessToken.value),
         refreshToken: computed(() => refreshToken.value),
         returnUrl: computed(() => returnUrl.value),
         isAuthenticated: computed(() => currentUser.value !== null),
         ...actions
      };
   },
   {
      persist: {
         key: appConfig.key.auth
      }
   }
);
