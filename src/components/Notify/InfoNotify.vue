<template>
   <v-alert
      v-bind:closable="props.closable"
      v-bind:icon-size="'22px'"
      type="info"
      density="comfortable"
      variant="tonal">
      <div class="text-xs flex items-center">
         <slot />
      </div>

      <template
         v-if="props.closable"
         v-slot:close="{ props: slotProps }">
         <v-btn
            density="compact"
            icon="$close"
            v-ripple
            size="default"
            variant="text"
            @click="slotProps.onClick()" />
      </template>
   </v-alert>
</template>

<script lang="ts" setup>
import type { TAlert } from "@/utils/types";
type TProps = {
   closable?: boolean;
};

// states
const props = withDefaults(defineProps<TAlert & TProps>(), {
   closable: true
});
</script>
