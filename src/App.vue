<template>
   <v-fade-transition leave-absolute>
      <LayoutLoader v-if="loading" />

      <component
         v-else
         v-bind:is="$route.meta.layout" />
   </v-fade-transition>

   <VueQueryDevtools />
</template>

<script lang="ts" setup>
import LayoutLoader from "@/components/Layout/Loader/LayoutLoader.vue";
import { VueQueryDevtools } from "@tanstack/vue-query-devtools";

const appStore = useAppStore();
const loading = computed(() => appStore.layoutLoading || appStore.menuLoading || appStore.localeLoading);

onMounted(() => {
   if (vuetify.defaults.value?.global?.ripple === false) {
      document.documentElement.classList.add("v-ripple--false");
   }
});
</script>
