import DefaultLayout from "@/components/Layout/DefaultLayout.vue";
import ErrorLayout from "@/components/Layout/ErrorLayout.vue";

declare module "vue-router" {
   interface RouteMeta {
      layout?: any;
      title?: string | (() => string);
      breadcrumb?: string | (() => string);
      requiredAuth?: boolean;
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
      name: appConfig.router.name,
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

router.beforeEach(async (to, from, next) => {
   const appStore = useAppStore();
   const authStore = useAuthStore();

   if (from.meta.layout !== to.meta.layout) {
      appStore.setLayoutLoading(true);
   }

   appStore.setModule(to.meta.module || "default");

   if (authStore.isAuthenticated) {
      if (to.path === appConfig.router.login) {
         return next(authStore.returnUrl || "/");
      }
   } else {
      if (to.meta.requiredAuth !== false && to.path !== appConfig.router.login) {
         authStore.setUrl(to.fullPath);
         return next(appConfig.router.login);
      }
   }

   next();
});

router.afterEach(async (to) => {
   const appStore = useAppStore();
   const authStore = useAuthStore();

   if (to.path !== appConfig.router.login) {
      authStore.setUrl(to.fullPath);
   }

   await sleepDelay();
   appStore.setLayoutLoading(false);
});
