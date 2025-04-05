<template>
   <v-fade-transition leave-absolute>
      <LayoutLoader v-if="appStore.layoutLoading" />

      <component
         v-else
         v-bind:is="route.meta.layout" />
   </v-fade-transition>

   <VueQueryDevtools />
</template>

<script lang="ts" setup>
import LayoutLoader from "@/assets/components/Loader/LayoutLoader.vue";
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";

const route = useRoute();
const appStore = useAppStore();

onMounted(() => {
   if (appConfig.default.ripple === false) {
      document.documentElement.classList.add("v-ripple--false");
   }
});
</script>
