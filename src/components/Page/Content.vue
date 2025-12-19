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
         v-if="$slots.prepend || $slots.append || $slots.extend"
         class="overflow-hidden rounded-t-sm"
         color="transparent">
         <v-toolbar-title
            v-if="$slots.prepend"
            class="text-base">
            <slot name="prepend" />
         </v-toolbar-title>

         <v-toolbar-items
            v-if="$slots.append"
            class="ms-auto">
            <slot name="append" />
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
