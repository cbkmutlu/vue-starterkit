import ErrorLayout from "@/assets/layouts/Error/Layout.vue";
import { pageRoutes } from "@/modules/Page/utils/routes";

declare module "vue-router" {
   interface RouteMeta {
      layout?: any;
      title?: string;
      breadcrumb?: string;
      auth?: boolean;
   }
}

const routes: RouteRecordRaw[] = [
   {
      path: "/",
      redirect: appConfig.router.redirect
   },
   ...pageRoutes,
   {
      path: "/:pathMatch(.*)",
      name: "404",
      meta: {
         title: "404",
         breadcrumb: "404",
         layout: ErrorLayout
      },
      component: getComponent(() => import("../assets/components/Error/ErrorComponent.vue"))
   }
];

const router = createRouter({
   history: createWebHistory(),
   routes
});

// router.beforeEach(async (to, _from, next) => {
//    const authStore = useAuthStore();

//    if (authStore.isAuthenticated && to.path === appConfig.router.login) {
//       return next(authStore.returnUrl || "/");
//    }

//    if (to.meta.auth !== false && to.path !== appConfig.router.login) {
//       authStore.setUrl(to.fullPath);
//       return next(appConfig.router.login);
//    }

//    next();
// });

router.beforeEach(async (_to, _from, next) => {
   const appStore = useAppStore();

   if (_from.meta.layout !== _to.meta.layout) {
      appStore.setLayoutLoading(true);
   }

   const locale = getUserLocale();
   await loadLocales(locale).then(() => {
      setUserLocale(locale);
   });
   next();
});

router.afterEach(async (to, _from, _next) => {
   const appStore = useAppStore();
   const authStore = useAuthStore();

   if (to.path !== appConfig.router.login) {
      authStore.setUrl(to.fullPath);
   }

   await timerSleep();
   appStore.setLayoutLoading(false);
   appStore.setComponentLoading(false);
});

export { router };

