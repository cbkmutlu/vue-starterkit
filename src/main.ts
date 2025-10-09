// #must be first
import "@/assets/style/main.scss";
// #rest
import App from "@/App.vue";
import { registerDirective } from "@/plugins/directive";
import { registerProvider } from "@/plugins/provider";
import { i18n } from "@/plugins/i18n";
import { pinia } from "@/plugins/pinia";
import { options, query } from "@/plugins/query";
import { router } from "@/plugins/router";
import { vuetify } from "@/plugins/vuetify";

const app = createApp(App);
app.use(pinia);
app.use(i18n);
app.use(vuetify);
app.use(query, options);

const appStore = useAppStore();

// route
await loadRoute().then((routes) => {
   routes.forEach((route) => {
      router.addRoute(route);
   });
});

// locale
appStore.setLocaleLoading(true);
await loadLocale(getLocale()).then((messages) => {
   setLocale(i18n, getLocale(), messages);
});
appStore.setLocaleLoading(false);

// menu
appStore.setMenuLoading(true);
await loadMenu().then((menu) => {
   appStore.setMenu({ ...menu });
});
appStore.setMenuLoading(false);

// register
registerProvider(app);
registerDirective(app);

// mount
app.use(router);
router.isReady().then(() => {
   app.mount("#app");
});
