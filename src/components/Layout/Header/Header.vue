<template>
   <v-app-bar
      density="compact"
      extension-height="40">
      <template v-slot:prepend>
         <v-app-bar-nav-icon
            density="comfortable"
            icon="$arrowleft"
            @click="$router.back()"></v-app-bar-nav-icon>
      </template>

      <v-toolbar-title class="ms-1">{{ title }}</v-toolbar-title>

      <template v-slot:extension>
         <HeaderBreadcrumb />
      </template>

      <template
         v-slot:append
         class="flex gap-2">
         <div class="flex gap-2">
            <v-btn icon="$search" />
            <v-btn icon="$notification" />
            <v-btn
               icon
               @click="toggleTheme()">
               <ToggleIcon
                  v-bind:icon="['$sun', '$moon', '$color']"
                  v-bind:list="['light', 'dark', 'system']"
                  v-bind:toggle="theme" />
            </v-btn>
            <HeaderLocaleMenu />
            <HeaderMoreMenu />
         </div>
      </template>
   </v-app-bar>
</template>

<script lang="ts" setup>
import ToggleIcon from "@/components/Form/ToggleIcon.vue";
import HeaderBreadcrumb from "@/components/Layout/Header/HeaderBreadcrumb.vue";
import HeaderLocaleMenu from "@/components/Layout/Header/HeaderLocaleMenu.vue";
import HeaderMoreMenu from "@/components/Layout/Header/HeaderMoreMenu.vue";

const route = useRoute();
const { t } = useI18n();

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
