import DefaultLayout from "@/components/Layout/DefaultLayout.vue";
import ErrorLayout from "@/components/Layout/ErrorLayout.vue";

declare module "vue-router" {
   interface RouteMeta {
      layout?: any;
      title?: string | (() => string);
      breadcrumb?: string | (() => string);
      requiredAuth?: boolean;
      guestOnly?: boolean;
      module?: string;
   }

   interface RouteLocationNormalizedLoadedGeneric {
      params: {
         id: number;
      };
   }
}

const routes: RouteRecordRaw[] = [
   {
      path: "/",
      name: "routeBase",
      meta: {
         layout: DefaultLayout
      },
      children: [
         {
            path: "",
            name: "routeRedirect",
            redirect: appConfig.router.redirect
         }
      ]
   },
   {
      path: "/:pathMatch(.*)",
      name: "routeNotFound",
      meta: {
         layout: ErrorLayout
      },
      component: getComponent(() => import("@/components/Layout/ErrorComponent.vue"))
   }
];

export const router = createRouter({
   history: createWebHistory(),
   strict: true,
   routes,
   scrollBehavior(_to, _from, savedPosition) {
      if (!savedPosition) {
         return new Promise((resolve) => {
            setTimeout(() => {
               const scroller = document.querySelector("#scroll-target");
               if (scroller) {
                  scroller.scrollTo({ top: 0, behavior: "instant" });
               }
               resolve(false);
            }, 50);
         });
      }
   }
});

router.beforeEach(async (to, from) => {
   const appStore = useAppStore();
   const authStore = useAuthStore();
   const isAuthenticated = authStore.isAuthenticated;
   const requiredAuth = to.meta.requiredAuth ?? appConfig.router.requiredAuth;
   const guestOnly = to.meta.guestOnly === true;

   if (to.path !== "/" && to.path.endsWith("/")) {
      return {
         path: to.path.slice(0, -1),
         query: to.query,
         hash: to.hash,
         replace: true
      };
   }

   if (from.meta.layout !== to.meta.layout) {
      appStore.setLayoutLoading(true);
   }

   appStore.setModule(to.meta.module || "default");

   if (requiredAuth && !isAuthenticated) {
      return {
         path: appConfig.router.login,
         replace: true
      };
   }

   if (guestOnly && isAuthenticated) {
      return {
         path: authStore.returnUrl || "/",
         replace: true
      };
   }

   return true;
});

router.afterEach(async (to) => {
   const appStore = useAppStore();
   const authStore = useAuthStore();
   const isAuthenticated = authStore.isAuthenticated;
   const guestOnly = to.meta.guestOnly === true;

   if (isAuthenticated && !guestOnly) {
      authStore.setUrl(to.fullPath);
   }

   await sleepDelay();
   appStore.setLayoutLoading(false);
});
