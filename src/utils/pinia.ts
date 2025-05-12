const pinia = createPinia();
pinia.use(({ store }) => {
   store.$router = markRaw(router);
});

pinia.use(persistedstate);
export { pinia };

