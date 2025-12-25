import DefaultLayout from "@/components/Layout/DefaultLayout.vue";
import ErrorLayout from "@/components/Layout/ErrorLayout.vue";
import LoginLayout from "@/components/Layout/LoginLayout.vue";
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
      path: "/login",
      name: "login",
      meta: {
         auth: false,
         layout: LoginLayout
      },
      component: getComponent(() => import("@/pages/User/UserLogin.vue"))
   },
   {
      path: "/",
      redirect: appConfig.router.redirect,
      meta: {
         layout: DefaultLayout
      },
      children: [
         {
            path: "user",
            meta: {
               title: () => i18n.global.t("app.profile"),
               breadcrumb: () => i18n.global.t("app.profile")
            },
            component: getComponent(() => import("@/pages/User/UserLayout.vue")),
            children: [
               {
                  path: "",
                  redirect: "/user-profile"
               },
               {
                  path: "profile",
                  name: "user-profile",
                  alias: "/user-profile",
                  component: getComponent(() => import("@/pages/User/UserProfile.vue"))
               },
               {
                  path: "password",
                  name: "user-password",
                  alias: "/user-password",
                  component: getComponent(() => import("@/pages/User/UserPassword.vue"))
               }
            ]
         },
         // product
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
         // category
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
               }
            ]
         },
         // brand
         {
            path: "brand",
            meta: {
               title: () => i18n.global.t("app.brand", 2),
               breadcrumb: () => i18n.global.t("app.brandList")
            },
            children: [
               {
                  path: "",
                  name: "brandList",
                  component: getComponent(() => import("@/pages/Brand/BrandList.vue"))
               }
            ]
         }
      ]
   }
];

export default appRoutes;
