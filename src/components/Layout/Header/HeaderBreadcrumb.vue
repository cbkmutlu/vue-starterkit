<template>
   <v-breadcrumbs class="ms-4 p-0 text-xs">
      <template
         v-for="(item, index) in items"
         v-bind:key="item">
         <v-breadcrumbs-item
            v-bind:class="{ 'font-semibold': index === items.length - 1 }"
            v-bind:exact="appConfig.router.exact"
            v-bind:to="!(index === items.length - 1) ? item.path : undefined">
            {{ item.breadcrumb }}
         </v-breadcrumbs-item>

         <v-icon
            v-if="index < items.length - 1"
            icon="$next"
            size="x-small" />
      </template>
   </v-breadcrumbs>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const route = useRoute();

const items = computed(() => {
   return route.matched
      .filter((item) => {
         return item.meta?.breadcrumb;
      })
      .map((item) => {
         return {
            breadcrumb: typeof item.meta.breadcrumb === "function" ? item.meta.breadcrumb() : t(item.meta.breadcrumb as string),
            path: item.path
         };
      });
});
</script>
