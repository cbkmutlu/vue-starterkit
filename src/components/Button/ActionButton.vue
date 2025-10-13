<template>
   <v-btn
      v-bind:="$attrs"
      v-bind:color="props.color"
      density="default"
      variant="flat">
      <template v-if="$attrs.text">
         {{ $attrs.text }}
      </template>
      <template v-else>
         <slot />
      </template>
   </v-btn>
</template>

<script lang="ts" setup>
import type { TBtn } from "@/utils/types";

// states
const props = withDefaults(defineProps<TBtn & { color?: string }>(), {
   color: "success"
});
</script>
