import DefaultLayout from "@/components/Layout/DefaultLayout.vue";
import ErrorLayout from "@/components/Layout/ErrorLayout.vue";
import { i18n } from "@/plugins/i18n";

const appRoutes: RouteRecordRaw[] = [
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

export default appRoutes;
