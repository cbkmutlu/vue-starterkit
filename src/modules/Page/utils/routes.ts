import DefaultLayout from "@/assets/layouts/Default/Layout.vue";

export const pageRoutes: RouteRecordRaw[] = [
   {
      path: "/page",
      name: "Test Page",

      meta: {
         title: "Test Page",
         breadcrumb: "Test Page",
         layout: DefaultLayout
      },

      children: [
         {
            path: ":id",
            name: "Sub Page 1",
            component: getComponent(() => import("../pages/Page1.vue")),

            meta: {
               title: "Sub Page 1",
               breadcrumb: "Sub Page 1"
            }
         },
         {
            path: "/page/page2",
            name: "Sub Page 2",
            component: getComponent(() => import("../pages/Page2.vue"))
         }
      ]
   }
];
