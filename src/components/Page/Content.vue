<template>
   <v-card class="mb-4 overflow-visible">
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
         v-if="$slots.title || $slots.subtitle || $slots.append || $slots.extend"
         class="overflow-hidden rounded-t-sm"
         color="transparent"
         extension-height="52">
         <v-toolbar-title v-if="$slots.title || $slots.subtitle">
            <div>
               <div
                  v-if="$slots.title"
                  class="text-base">
                  <slot name="title" />
               </div>
               <div
                  v-if="$slots.subtitle"
                  class="text-sm opacity-60">
                  <slot name="subtitle" />
               </div>
            </div>
         </v-toolbar-title>

         <template
            v-if="$slots.append"
            v-slot:append>
            <slot name="append" />
         </template>

         <v-toolbar-items
            v-if="$slots.items"
            class="ms-auto">
            <slot name="items" />
         </v-toolbar-items>

         <template
            v-if="$slots.extend"
            v-slot:extension>
            <slot name="extend" />
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
