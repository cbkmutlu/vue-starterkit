// icons
// import { mdi } from "vuetify/iconsets/mdi-svg";

// colors
// import tailwindColors from "./tailwind3";
// import vuetifyColors from "vuetify/util/colors";
import tailwindColors from "tailwindcss/colors";

// vuetify
import * as labsComponents from "vuetify/labs/components";
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";

const colorScheme = {
   light: {
      colors: {
         // background: formatOklch(tailwind.slate["900"]),
         // surface: formatOklch(tailwind.slate["800"]),
         primary: tailwind3.sky["600"],
         secondary: tailwind3.teal["600"],
         error: tailwind3.red["600"],
         info: tailwind3.violet["600"],
         success: tailwind3.emerald["600"],
         warning: tailwind3.amber["600"]
      }
   },
   dark: {
      colors: {
         primary: formatOklch(tailwindColors.sky["600"])
      }
   }
};

export const vuetify = createVuetify({
   components: {
      ...labsComponents
   },
   locale: {
      adapter: createVueI18nAdapter({ i18n, useI18n })
   },
   theme: {
      defaultTheme: getUserTheme(),
      themes: {
         ...colorScheme
      }
   },
   defaults: {
      global: {
         ripple: appConfig.default.ripple
      },
      VToolbar: {
         flat: true,
         density: "comfortable"
      },
      VDialog: {
         scrim: "rgb(var(--v-theme-on-surface-bright))",
         persistent: true,
         noClickAnimation: true,

         VCard: {
            elevation: 8
         },
         VToolbar: {
            density: "compact"
         },
         VCardActions: {
            // VBtn: {
            //    density: "default"
            // }
         }
      },
      VBtn: {
         variant: "text",
         density: "comfortable"
      },
      VDatePicker: {
         VDatePickerMonth: {
            VBtn: {
               density: "default"
            }
         }
      },
      VTextField: {
         clearable: true,
         density: "compact",
         variant: "underlined"
      },
      VTextarea: {
         clearable: true,
         density: "compact",
         variant: "underlined"
      },
      VMenu: {
         scrim: "rgb(var(--v-theme-on-surface-bright))"
      },
      VSelect: {
         clearable: true,
         density: "compact",
         variant: "underlined",
         eager: true,
         menuProps: { scrim: "rgb(var(--v-theme-on-surface-bright))" }
      },
      VAutocomplete: {
         clearable: true,
         density: "compact"
      },
      VSheet: {
         border: true,
         rounded: true
      },
      VList: {
         lines: false,
         nav: true,
         slim: true
      },
      VIcon: {
         size: "small"
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
      }
   },
   icons: {
      defaultSet: "tabler",
      aliases: {
         // ...aliases,
         ...tablerAliases
      },
      sets: {
         tabler
      }
   }
});
