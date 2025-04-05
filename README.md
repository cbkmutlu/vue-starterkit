### create

```cmd
> npm create vite .
> Vue
> TypeScript
```

### packages

```cmd
> npm i @mdi/js @tanstack/vue-query axios pinia pinia-plugin-persistedstate vue-i18n vue-router vuetify
> npm i -D @types/node @intlify/unplugin-vue-i18n @tanstack/vue-query-devtools unplugin-auto-import
> npm i -D prettier prettier-plugin-organize-attributes prettier-plugin-tailwindcss vite-plugin-vuetify vite-plugin-webfont-dl
> npm i -D autoprefixer tailwindcss @tailwindcss/vite
? npm i -D ts-node postcss sass esbuild-sass-plugin
```

### routing

- `App.vue` içerisinde yer alan `<component>` ile `route`lardan gelen `meta.layout` dinamik olarak render edilir.
- Layout dizininde toplanan `<layout>` içerisinde `<header>`, `<main>` ve `<footer>` vb. olur ve `index.ts` içerisinde toplanır.
- `<main>` içerisinde `<router-view>` olur.
- `modules`klasöründeki diğer `route`lar `import` edilir.
- Routelar `meta.auth` varsayılan olarak `true` kabul edilir. Bir sayfanın `auth` olmasını istemezsek `false` olarak ayarlanır.

### i18n

`config` içerisindeki `support.module` anahtarına tanımlı modüllerin dil dosyaları otomatik olarak yüklenir.

### legacy support

```cmd
> npm i -D @vitejs/plugin-legacy browserslist browserslist-to-esbuild
```

```js
// vite.config.ts
export default defineConfig(async ({ mode }) => {
   return {
      plugins: [
         legacy({
            modernPolyfills: true,
            renderLegacyChunks: false,
            modernTargets: browserslist.loadConfig({
               path: resolve(__dirname)
            })
         })
      ],
      build: {
         target: browserslistToEsbuild(["> 1%", "last 2 versions", "not op_mini all", "not ie>0"])
      }
   };
});
```

### optimize deeps

```cmd
> npm i -D esbuild-sass-plugin
```

```js
// vite.config.ts
export default defineConfig(async ({ mode }) => {
   return {
      optimizeDeps: {
         esbuildOptions: {
            plugins: [
               (await import("esbuild-sass-plugin")).sassPlugin({
                  type: "style",
                  logger: { warn() {} }
               })
            ],
            define: {
               global: "globalThis"
            }
         }
      }
   };
});
```
