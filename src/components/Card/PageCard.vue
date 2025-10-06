<template>
   <div
      v-if="$slots.header || $slots.actions"
      class="flex h-12 justify-between gap-2">
      <slot name="header" />
      <v-spacer />
      <slot name="actions" />
   </div>

   <v-card
      v-bind="{ ...$attrs }"
      v-bind:loading="props.loading"
      class="mb-4 overflow-visible">
      <v-toolbar
         class="overflow-hidden rounded-t-sm"
         color="transparent">
         <v-toolbar-title
            v-if="$slots.title"
            class="text-base">
            <slot name="title" />
         </v-toolbar-title>

         <v-toolbar-items v-if="$slots.items">
            <slot name="items" />
         </v-toolbar-items>
      </v-toolbar>

      <slot />
   </v-card>
</template>

<script lang="ts" setup>
import type { TCard } from "@/utils/vuetify";

type TProps = {
   loading?: boolean;
};

const props = withDefaults(defineProps<TCard & TProps>(), {
   loading: false
});
</script>
