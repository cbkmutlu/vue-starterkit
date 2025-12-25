<template>
   <v-app-bar
      density="compact"
      extension-height="40">
      <template v-slot:prepend>
         <!-- <v-app-bar-nav-icon
            density="comfortable"
            icon="$arrowleft"
            @click="$router.back" /> -->
         <v-app-bar-nav-icon
            density="comfortable"
            icon="$menu"
            @click="drawer = !drawer" />
      </template>

      <v-toolbar-title class="ms-1 text-base">{{ title }}</v-toolbar-title>

      <!-- <template v-slot:extension>
         <Breadcrumb class="ms-4 text-xs" />
      </template> -->

      <template
         v-slot:append
         class="flex gap-2">
         <div class="flex gap-2">
            <v-btn icon="$search" />
            <v-btn icon="$notification" />
            <v-btn
               icon
               @click="toggleTheme(vuetify.theme)">
               <ToggleIcon
                  v-bind:icon="['$sun', '$moon', '$color']"
                  v-bind:list="['light', 'dark', 'system']"
                  v-bind:toggle="theme" />
            </v-btn>
            <LocaleMenu />
            <MoreMenu />
         </div>
      </template>

      <ComponentLoader />
   </v-app-bar>
</template>

<script lang="ts" setup>
import ToggleIcon from "@/components/Form/ToggleIcon.vue";
import LocaleMenu from "@/components/Layout/Header/LocaleMenu.vue";
import MoreMenu from "@/components/Layout/Header/MoreMenu.vue";
import ComponentLoader from "@/components/Layout/Loader/ComponentLoader.vue";
import { vuetify } from "@/plugins/vuetify";

// hooks
const route = useRoute();
const { t } = useI18n();

// states
const drawer = defineModel("drawer", { type: Boolean, default: false });
const theme = computed(() => {
   return vuetify.theme.isSystem.value ? "system" : vuetify.theme.current.value.dark ? "dark" : "light";
});

const title = computed(() => {
   return route.matched
      .filter((item) => {
         return item.meta?.title;
      })
      .map((item) => {
         return typeof item.meta.title === "function" ? item.meta.title() : t(item.meta.title as string);
      })
      .slice(-1)[0];
});
</script>
