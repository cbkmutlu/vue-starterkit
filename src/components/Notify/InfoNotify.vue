<template>
   <v-alert
      v-bind:closable="props.closable"
      v-bind:icon-size="'22px'"
      type="info"
      density="compact"
      variant="tonal">
      <slot />

      <template
         v-if="props.closable"
         v-slot:close="{ props: slotProps }">
         <v-btn
            v-ripple
            density="compact"
            icon="$close"
            size="default"
            variant="text"
            @click="slotProps.onClick" />
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
