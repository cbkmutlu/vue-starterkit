import DefaultLayout from "@/components/Layout/DefaultLayout.vue";
import ErrorLayout from "@/components/Layout/ErrorLayout.vue";

declare module "vue-router" {
   interface RouteMeta {
      layout?: any;
      title?: string | (() => string);
      breadcrumb?: string | (() => string);
      auth?: boolean;
      module?: string;
   }
}

export type TRoute = RouteLocationNormalizedLoaded & {
   params: {
      id: string;
   };
};

export const registerRoutes = async (): Promise<Router> => {
   (await loadRoute()).forEach((route) => {
      router.addRoute(route);
   });
   return router;
};

const routes: RouteRecordRaw[] = [
   {
      path: "/",
      redirect: appConfig.router.redirect
   },
   {
      path: "/:pathMatch(.*)",
      name: "NotFound",
      meta: {
         title: "404",
         breadcrumb: "404",
         layout: ErrorLayout
      },
      component: getComponent(() => import("@/components/Layout/ErrorComponent.vue"))
   },
   {
      path: "/",
      redirect: appConfig.router.redirect,
      meta: {
         layout: DefaultLayout
      },
      children: [
         {
            path: "product",
            meta: {
               title: () => i18n.global.t("app.product", 2),
               breadcrumb: () => i18n.global.t("app.productList")
            },
            children: [
               {
                  path: "",
                  name: "productList",
                  component: getComponent(() => import("@/pages/Product/ProductList.vue"))
               },
               {
                  path: ":id([0-9]+)",
                  name: "productDetail",
                  component: getComponent(() => import("@/pages/Product/ProductDetail.vue")),
                  meta: {
                     breadcrumb: () => i18n.global.t("app.productDetail")
                  }
               },
               {
                  path: "create",
                  name: "productCreate",
                  component: getComponent(() => import("@/pages/Product/ProductDetail.vue")),
                  meta: {
                     breadcrumb: () => i18n.global.t("app.productCreate")
                  }
               }
            ]
         },
         {
            path: "category",
            meta: {
               title: () => i18n.global.t("app.category", 2),
               breadcrumb: () => i18n.global.t("app.categoryList")
            },
            children: [
               {
                  path: "",
                  name: "categoryList",
                  component: getComponent(() => import("@/pages/Category/CategoryList.vue"))
               },
               {
                  path: ":id([0-9]+)",
                  name: "categoryDetail",
                  component: getComponent(() => import("@/pages/Category/CategoryDetail.vue")),
                  meta: {
                     breadcrumb: () => i18n.global.t("app.categoryDetail")
                  }
               },
               {
                  path: "create",
                  name: "categoryCreate",
                  component: getComponent(() => import("@/pages/Category/CategoryDetail.vue")),
                  meta: {
                     breadcrumb: () => i18n.global.t("app.categoryCreate")
                  }
               }
            ]
         }
      ]
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

// ALTER
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
