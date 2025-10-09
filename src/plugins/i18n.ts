export const i18n = createI18n({
   locale: getLocale(),
   legacy: false,
   fallbackLocale: appConfig.language.default,
   globalInjection: false,
   missingWarn: false,
   fallbackWarn: false
});