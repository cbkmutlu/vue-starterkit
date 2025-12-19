<template>
   <v-menu
      offset="3, 0"
      transition="dialog-transition">
      <template v-slot:activator="{ props: slotProps }">
         <v-btn
            v-bind="slotProps"
            v-bind:loading="isLoading"
            icon="$translate" />
      </template>

      <v-list
         v-bind:slim="false"
         class="select-none">
         <v-list-item
            v-for="(locale, key) in appConfig.language.locales"
            @click="translateHandler(key)">
            <template v-slot:append>
               <v-icon v-html="locale.flag" />
            </template>

            <template v-slot:title>
               {{ locale.name }}
            </template>
         </v-list-item>
      </v-list>
   </v-menu>
</template>

<script lang="ts" setup>
import { i18n } from "@/plugins/i18n";

// hooks
const snackbarStore = useSnackbarStore();

// states
const isLoading = ref(false);

// handlers
const translateHandler = async (locale: string) => {
   try {
      isLoading.value = true;
      const messages = await loadLocale(locale);
      setLocale(i18n, locale, messages);
   } catch (error) {
      snackbarStore.error(error);
   } finally {
      isLoading.value = false;
   }
};
</script>
