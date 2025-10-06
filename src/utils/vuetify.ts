import { AllowedComponentProps, VNodeProps } from "@vue/runtime-dom";
import { VBtn, VCard, VContainer, VDataTable, VDatePicker, VListItem, VSelect, VTextField, VToolbar } from "vuetify/components";

/* @vue-ignore */
type ComponentProps<C extends Component> = C extends new (...args: any) => any ? Omit<InstanceType<C>["$props"], keyof VNodeProps | keyof AllowedComponentProps> : never;
/* @ts-ignore */
type UnwrapReadonlyArray<A> = A extends Readonly<Array<infer I>> ? I : A;
/* @ts-ignore */
type Neverify<T> = { [K in keyof T]?: never };
/* @ts-ignore */
type TListBase = {
   title?: string | (() => string);
   subtitle?: string | (() => string);
   type?: "subheader";
   props?: Partial<ComponentProps<typeof VListItem>>;
};
type TListWithChildren = TListBase & {
   props: Partial<ComponentProps<typeof VListItem>> & {
      value: string;
   };
   children: TList[];
};
type TListWithoutChildren = TListBase & {
   props?: Partial<ComponentProps<typeof VListItem>>;
   children?: undefined;
};
type TListDivider = {
   type: "divider";
   title?: undefined;
   subtitle?: undefined;
   props?: undefined;
   children?: undefined;
};

/* @ts-ignore */
export type TList = TListWithChildren | TListWithoutChildren | TListDivider;
/* @ts-ignore */
export type TDataTable = Partial<ComponentProps<typeof VDataTable>>;
/* @ts-ignore */
export type TMultiSelect = Partial<ComponentProps<typeof VSelect>>;
/* @ts-ignore */
export type TDateField = Partial<ComponentProps<typeof VDatePicker>> & Partial<ComponentProps<typeof VTextField>>;
/* @ts-ignore */
export type TToolbar = Partial<ComponentProps<typeof VToolbar>>;
/* @ts-ignore */
export type TCard = Partial<ComponentProps<typeof VCard>>;
/* @ts-ignore */
export type TContainer = Partial<ComponentProps<typeof VContainer>>;
/* @ts-ignore */
export type TBtn = Partial<ComponentProps<typeof VBtn>>;
/* @ts-ignore */
export type TField = Partial<ComponentProps<typeof VTextField>>;

// import { mdi } from "vuetify/iconsets/mdi-svg";
// import vuetifyColors from "vuetify/util/colors";
// import tailwindColors from "tailwindcss/colors";
import * as labsComponents from "vuetify/labs/components";
import { createVueI18nAdapter } from "vuetify/locale/adapters/vue-i18n";

const colorScheme = {
   light: {
      colors: {
         error: tailwind3.red["600"],
         info: tailwind3.violet["600"],
         warning: tailwind3.amber["600"],
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
};

export const vuetify = createVuetify({
   locale: {
      adapter: createVueI18nAdapter({ i18n, useI18n })
   },
   date: {
      formats: {
         customWekdayNarrow: { weekday: "narrow" }
      }
   },
   components: {
      ...labsComponents
   },
   theme: {
      defaultTheme: getTheme(),
      themes: {
         ...colorScheme
      }
   },
   icons: {
      defaultSet: "tabler",
      aliases: {
         // ...aliases,
         ...tablerAliases
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
         scrim: "rgb(var(--v-theme-on-surface-bright))"
      },
      VSelect: {
         clearable: true,
         density: "compact",
         variant: "outlined",
         eager: true,
         // menuProps: { scrim: "rgb(var(--v-theme-on-surface-bright))" }

         VList: {
            density: "comfortable"
         }
      },
      VAutocomplete: {
         clearable: true,
         density: "compact",
         variant: "outlined",
         eager: true
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
