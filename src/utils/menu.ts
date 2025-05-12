export const appMenu: TList[] = [
   {
      itemType: "subheader",
      itemTitle: "Module 1",

   },
   {
      itemType: "divider",
   },
   {
      itemTitle: "Page 1",
      itemProps: {
         to: "/page/page1",
         icon: "$next"
      }
   },
   {
      itemTitle: "Page 2",
      itemProps: {
         to: "/page/page2",
         icon: "$next"
      }
   },
   {
      itemTitle: "Item 1",
      itemProps: {
         link: true,
         icon: "$next"
      }
   },
   {
      itemTitle: "Item 2",
      itemProps: {
         link: true,
         icon: "$next"
      }
   },
   {
      itemTitle: "Sub Menu",
      itemProps: {
         icon: "$next"
      },
      children: [
         {
            itemTitle: "Sub Page 1",
            itemProps: {
               to: "/subpage1",
               icon: "$next"
            }
         },
         {
            itemTitle: "Sub Page 2",
            itemProps: {
               to: "/subpage2",
               icon: "$next"
            }
         },
         {
            itemTitle: "Sub Item 1",
            itemProps: {
               link: true,
               icon: "$next"
            }
         },
         {
            itemTitle: "Sub Item  2",
            itemProps: {
               link: true,
               icon: "$next"
            }
         }
      ]
   }
];