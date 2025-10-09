declare module "vue-router" {
   interface RouteMeta {
      layout?: any;
      title?: string | (() => string);
      breadcrumb?: string | (() => string);
      auth?: boolean;
      module?: string;
   }
}

const routes: RouteRecordRaw[] = [
   {
      path: "/",
      redirect: appConfig.router.redirect
   }
];

export const router = createRouter({
   history: createWebHistory(),
   routes,
   scrollBehavior(_to, _from, savedPosition) {
      if (!savedPosition) {
         return new Promise((resolve) => {
            setTimeout(() => {
               const scroller = document.querySelector("#main");
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

   if (from.meta.layout !== to.meta.layout) {
      appStore.setLayoutLoading(true);
   }

   appStore.setModule(to.meta.module || "default");
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

// COMBAK
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
