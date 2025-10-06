export const registerI18n = async (): Promise<void> => {
   const { setLocale } = useLocale();
   await setLocale(getLocale(), { global: true });

   // ALTER
   // const appStore = useAppStore();
   // appStore.setLocaleLoading(true);
   // await loadLocale(getLocale())
   //    .then(() => {
   //       setLocale(getLocale());
   //    })
   //    .finally(() => {
   //       appStore.setLocaleLoading(false);
   //    });
};

export const i18n = createI18n({
   locale: getLocale(),
   legacy: false,
   fallbackLocale: appConfig.language.default,
   globalInjection: false,
   missingWarn: false,
   fallbackWarn: false
});
