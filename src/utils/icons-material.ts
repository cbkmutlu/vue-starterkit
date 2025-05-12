import {
   mdiAccount,
   mdiAccountCog,
   mdiAccountMinus,
   mdiAccountPlus,
   mdiBell,
   mdiChevronLeft,
   mdiChevronRight,
   mdiCog,
   mdiDotsVertical,
   mdiHandshake,
   mdiLogin,
   mdiLogout,
   mdiMagnify,
   mdiTranslate,
   mdiWeatherNight,
   mdiWeatherSunny
} from "@mdi/js";
import { VSvgIcon } from "vuetify/components";

const matAliases = {
   handShake: mdiHandshake,
   notification: mdiBell,
   search: mdiMagnify,
   dots: mdiDotsVertical,
   translate: mdiTranslate,
   settings: mdiCog,

   // account
   accountProfile: mdiAccount,
   accountAdd: mdiAccountPlus,
   accountRemove: mdiAccountMinus,
   accountSettings: mdiAccountCog,
   accountLogin: mdiLogin,
   accountLogout: mdiLogout,

   // theme
   themeDark: mdiWeatherNight,
   themeLight: mdiWeatherSunny,

   // arrow
   chevronRight: mdiChevronRight,
   chevronLeft: mdiChevronLeft
};

const mat = {
   // component: (props: IconProps) => {
   //    return h(props.tag, [
   //       h(
   //          "svg",
   //          {
   //             class: "v-icon__svg",
   //             xmlns: "http://www.w3.org/2000/svg",
   //             viewBox: "0 0 24 24",
   //             role: "img",
   //             "aria-hidden": "true"
   //          },
   //          [h("path", { d: mdiAliases[props.icon] })]
   //       )
   //    ]);
   // }
   component: (props: IconProps) => {
      return h(VSvgIcon, {
         ...props,
         icon: matAliases[props.icon as keyof typeof matAliases]
      });
   }
};

export { mat, matAliases };

