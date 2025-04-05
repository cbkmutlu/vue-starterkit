import { TR, US } from "country-flag-icons/string/3x2";

export const appConfig = {
   default: {
      layout: "Default",
      boundary: "#main",
      theme: "light",
      locale: "tr-TR",
      sleep: 250,
      transition: true,
      ripple: false
   },
   router: {
      exact: false,
      redirect: "/procedure",
      login: "/login"
   },
   support: {
      locale: {
         "tr-TR": {
            name: "Türkçe",
            flag: TR
         },
         "en-US": {
            name: "English",
            flag: US
         }
      },
      module: ["Page"]
   },
   retry: {
      attempt: 3,
      delay: 1000, //ms
      gradual: true //1000 => 2000 => 4000 => 8000
   },
   tanstack: {
      cache: 30, //minutes
      stale: 3 //minutes
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
      },
      picker: {
         weekday: "short"
      }
   }
};
