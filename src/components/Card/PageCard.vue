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
      class="mb-4 overflow-visible">
      <template v-slot:loader>
         <v-fade-transition leave-absolute>
            <v-progress-linear
               v-if="props.loading"
               class="rounded-t-full"
               color="primary"
               height="2"
               indeterminate />
         </v-fade-transition>
      </template>

      <v-toolbar
         v-if="$slots.title || $slots.items || $slots.append"
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

         <template v-slot:append v-if="$slots.append">
            <div class="me-1">
               <slot name="append" />
            </div>
         </template>

         <template v-slot:extension v-if="$slots.extension">
            <slot name="extension" />
         </template>
      </v-toolbar>

      <slot />
   </v-card>
</template>

<script lang="ts" setup>
import type { TCard } from "@/utils/types";
type TProps = {
   loading?: boolean;
};

// states
const props = withDefaults(defineProps<TCard & TProps>(), {
   loading: false
});
</script>
