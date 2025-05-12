export const i18n = createI18n({
   locale: localStorage.getItem(appConfig.key.locale) as string,
   legacy: false,
   fallbackLocale: appConfig.default.locale,
   globalInjection: false,
   missingWarn: false,
   fallbackWarn: false
});
