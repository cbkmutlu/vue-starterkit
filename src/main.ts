// must be imported first
import "@/assets/style/main.scss";

import App from "@/App.vue";

const app = createApp(App);
registerProviders(app);
registerDirectives(app);

app.use(pinia);
app.use(router);
app.use(i18n);
app.use(vuetify);
app.use(query, queryOptions);
app.mount("#app");

// app.mixin({
//    created() {
//       console.log("[created] " + this.$options.name);
//    }
// });

