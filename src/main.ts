// #1 must be first
import "@/assets/style/main.scss";
// #2
import App from "@/App.vue";

const app = createApp(App);

app.use(pinia);
app.use(i18n);
app.use(vuetify);
app.use(query, queryOptions);
registerRoutes().then((routes) => {
   app.use(routes);
   app.mount("#app");
});
registerI18n();
registerMenu();
registerProviders(app);
registerDirectives(app);

// ALTER
// app.mixin({
//    created() {
//       console.log("[created] " + this.$options.name);
//    }
// });
