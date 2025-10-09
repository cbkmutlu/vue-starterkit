import { i18n } from "@/plugins/i18n";

const appMenu: TList[] = [
   {
      type: "subheader",
      title: "Menu"
   },
   {
      type: "divider"
   },
   {
      title: () => i18n.global.t("app.product", 2),
      props: {
         prependIcon: "$detail",
         to: "/product"
      }
   },
   {
      title: () => i18n.global.t("app.category", 2),
      props: {
         prependIcon: "$gridAdd",
         to: "/category"
      }
   },
   {
      title: "Test",
      props: {
         prependIcon: "$browser",
         value: "test"
      },
      children: [
         {
            title: "Item 1",
            props: {
               prependIcon: "$arrowright",
               link: true
            }
         },
         {
            title: "Item 2",
            props: {
               prependIcon: "$arrowright",
               link: true
            }
         }
      ]
   }
];

export default appMenu;
