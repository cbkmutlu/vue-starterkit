// #must be first
import "@/assets/style/main.scss";
// #rest
import App from "@/App.vue";
import { registerDirective } from "@/plugins/directive";
import { i18n } from "@/plugins/i18n";
import { pinia } from "@/plugins/pinia";
import { registerProvider } from "@/plugins/provider";
import { options, query } from "@/plugins/query";
import { router } from "@/plugins/router";
import { vuetify } from "@/plugins/vuetify";

const app = createApp(App);

app.use(pinia);
app.use(i18n);
app.use(vuetify);
app.use(query, options);

registerProvider(app);
registerDirective(app);

(async () => {
   const appStore = useAppStore();

   appStore.setLocaleLoading(true);
   appStore.setMenuLoading(true);

   const [messages, menu, routes] = await Promise.all([loadLocale(getLocale()), loadMenu(), loadRoute()]);

   setLocale(i18n.global, getLocale(), messages);
   appStore.setMenu(menu);

   routes.forEach((route) => {
      router.addRoute(appConfig.router.name, route);
   });

   appStore.setLocaleLoading(false);
   appStore.setMenuLoading(false);

   app.use(router);
   router.isReady().then(() => {
      app.mount("#app");
   });
})().catch((error) => {
   console.error("Bootstrap failed", error);
});
