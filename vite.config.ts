import vuei18n from "@intlify/unplugin-vue-i18n/vite";
import tailwindcss from "@tailwindcss/postcss";
import vue from "@vitejs/plugin-vue";
import autoprefixer from "autoprefixer";
import { resolve } from "node:path";
import autoImport from "unplugin-auto-import/vite";
import { defineConfig, loadEnv } from "vite";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import webfont from "vite-plugin-webfont-dl";

export default defineConfig(function ({ mode }) {
   const env: any = loadEnv(mode, process.cwd());

   return {
      base: "/",
      plugins: [
         vue({
            template: { transformAssetUrls }
         }),
         vuetify({
            autoImport: true,
            styles: {
               configFile: "src/assets/style/settings.scss"
            }
         }),
         vuei18n({
            runtimeOnly: false,
            compositionOnly: true,
            fullInstall: true,
            include: [resolve(__dirname, "src/locales/**"), resolve(__dirname, "src/modules/**/locales/**")]
         }),
         webfont(),
         autoImport({
            dirs: ["src/utils/", "src/stores/"],
            imports: [
               "vue",
               "vue-router",
               "vue-i18n",
               "pinia",
               {
                  from: "vue-router",
                  imports: ["createRouter", "createWebHistory"]
               },
               {
                  from: "vue-router",
                  imports: ["RouteLocation", "RouteRecordRaw", "Router", "RouteMeta", "RouteLocationNormalizedLoaded"],
                  type: true
               },
               {
                  from: "vue-i18n",
                  imports: ["createI18n"]
               },
               {
                  from: "pinia-plugin-persistedstate",
                  imports: [["default", "persistedstate"]]
               },
               {
                  from: "axios",
                  imports: [["default", "axios"]]
               },
               {
                  from: "@tanstack/vue-query",
                  imports: ["useMutation", "useQuery", "useQueryClient", "VueQueryPlugin"]
               },
               {
                  from: "@tanstack/vue-query",
                  imports: ["VueQueryPluginOptions", "UseQueryReturnType", "UseQueryOptions"],
                  type: true
               },
               {
                  from: "vuetify",
                  imports: ["useTheme", "useDate"]
               }
            ],
            dts: "./vite-imports.d.ts",
            vueTemplate: true,
            viteOptimizeDeps: true
         })
      ],
      css: {
         postcss: {
            plugins: [autoprefixer, tailwindcss]
         }
      },
      server: {
         port: env.VITE_PORT,
         proxy: {
            "/api": {
               target: env.VITE_API,
               changeOrigin: true,
               secure: false,
               ws: true,
               rewrite: (path: string) => path.replace(/^\/api/, "/api")
            }
         },
         cors: {
            origin: "*",
            methods: "GET, PUT, POST, DELETE",
            allowedHeaders: "*",
            exposedHeaders: "*",
            preflightContinue: true,
            optionsSuccessStatus: 204,
            credentials: true
         }
      },
      resolve: {
         alias: {
            "@": resolve(__dirname, "./src")
         },
         extensions: [".js", ".ts", ".vue", ".json"]
      },
      optimizeDeps: {
         exclude: ["vuetify", "vue-router"],
         extensions: [".scss", ".sass"],
         entries: ["./src/**/*.vue"],
         esbuildOptions: {
            define: {
               global: "globalThis"
            }
         }
      },
      build: {
         cssCodeSplit: false,
         minify: "esbuild",
         chunkSizeWarningLimit: 1024,
         rollupOptions: {
            output: {
               chunkFileNames: "assets/[name]-[hash].js",
               manualChunks: {
                  http: ["axios", "@tanstack/vue-query"],
                  icons: ["@mdi/js", "@tabler/icons-vue", "@phosphor-icons/vue", "country-flag-icons"],
                  utils: ["vue-router", "vue-i18n", "pinia", "pinia-plugin-persistedstate", "maska"],
                  vuetify: ["vuetify"],
                  vue: ["vue"]
               }
            }
         }
      },
      define: {
         global: "window"
      }
   };
});
