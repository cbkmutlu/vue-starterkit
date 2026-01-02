import { i18n } from "@/plugins/i18n";
import { createVuetify } from "vuetify";
import { VFileUpload, VFileUploadItem } from "vuetify/labs/VFileUpload";
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";
// import vuetifyColors from "vuetify/util/colors";
// import tailwindColors from "tailwindcss/colors";

export const vuetify = createVuetify({
   display: {
      mobileBreakpoint: "lg"
   },
   locale: {
      adapter: createVueI18nAdapter({ i18n, useI18n })
   },
   date: {
      formats: {
         // example
         customWekdayNarrow: { weekday: "narrow" }
      }
   },
   components: {
      VFileUpload,
      VFileUploadItem
   },
   theme: {
      defaultTheme: getTheme(),
      themes: {
         light: {
            colors: {
               // info: tailwind3.violet["600"],
               warning: tailwind3.orange["600"],
               "on-surface": tailwind3.neutral["800"],
               "on-background": tailwind3.neutral["800"]
            }
         },
         dark: {
            colors: {
               "on-surface": tailwind3.neutral["200"],
               "on-background": tailwind3.neutral["200"]
            }
         }
      }
   },
   icons: {
      defaultSet: "tabler",
      aliases: {
         ...tablerAliases
         // ...aliases
         // ...phoAliases
      },
      sets: {
         tabler
      }
   },
   defaults: {
      global: {
         ripple: true
      },
      VTabs: {
         density: "comfortable"
      },
      VSkeletonLoader: {
         type: "subtitle, divider, text@2, paragraph, subtitle, paragraph"
      },
      VToolbar: {
         flat: true,
         density: "compact"
      },
      VBreadcrumbs: {
         density: "compact"
      },
      VDialog: {
         // scrim: "rgb(var(--v-theme-on-surface-bright))",
         scrim: true,
         persistent: true,
         noClickAnimation: true,

         VCard: {
            elevation: 8
         },
         VToolbar: {
            density: "compact"
         }
      },
      VIcon: {
         size: "small"
      },
      VBtn: {
         variant: "text",
         density: "comfortable"
      },
      VDatePicker: {
         VBtn: {
            density: "default"
         }
      },
      VTextField: {
         clearable: true,
         density: "compact",
         variant: "outlined"
      },
      VNumberInput: {
         clearable: true,
         density: "compact",
         variant: "outlined"
      },
      VTextarea: {
         clearable: true,
         density: "compact",
         variant: "outlined",
         rows: 3
      },
      VMenu: {
         // scrim: "rgb(var(--v-theme-on-surface-bright))"
         scrim: true
      },
      VSelect: {
         clearable: true,
         density: "compact",
         variant: "outlined",
         // menuProps: { scrim: "rgb(var(--v-theme-on-surface-bright))" }

         VList: {
            density: "comfortable"
         }
      },
      VAutocomplete: {
         clearable: true,
         density: "compact",
         variant: "outlined"
      },
      VSheet: {
         border: true,
         rounded: true
      },
      VChip: {
         size: "small",
         label: true
      },
      VList: {
         lines: false,
         nav: true,
         slim: true,
         density: "comfortable"
      },
      VCheckbox: {
         color: "primary",

         VIcon: {
            size: "default"
         }
      },
      VCheckboxBtn: {
         color: "primary",
         density: "comfortable"
      },
      VRadioGroup: {
         color: "primary",

         VIcon: {
            size: "default"
         }
      },
      VDataTableFooter: {
         VSelect: {
            clearable: false
         }
      },
      VProgressLinear: {
         color: "primary"
      },
      VCol: {
         cols: 12
      }
   }
});
