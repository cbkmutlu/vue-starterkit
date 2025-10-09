import { US, TR } from "country-flag-icons/string/3x2";
import { en,tr } from "vuetify/locale";

export const appConfig = {
   module: [],
   router: {
      exact: false,
      redirect: "/product",
      login: "/login"
   },
   language: {
      default: "tr-TR",
      locales: {
         "tr-TR": {
            name: "Türkçe",
            flag: TR,
            vuetify: tr
         },
         "en-US": {
            name: "English",
            flag: US,
            vuetify: en
         }
      }
   },
   retry: {
      attempt: 3,
      delay: 1000, //ms
      gradual: true //1000 => 2000 => 4000 => 8000
   },
   tanstack: {
      cache: 30, //minutes
      stale: 3, //minutes
      refetch: true //refetch on window focus
   },
   key: {
      locale: "app.lang",
      theme: "app.theme",
      auth: "app.auth"
   },
   format: {
      date: {
         year: "numeric",
         month: "short",
         day: "2-digit"
      },
      time: {
         hour: "2-digit",
         minute: "2-digit"
      }
   }
};
