import { router } from "@/plugins/router";

export const pinia = createPinia();

pinia.use(persistedstate);
pinia.use(({ store }) => {
   store.$router = markRaw(router);
});
