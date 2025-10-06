<template>
   <v-btn
      v-bind:="$attrs"
      v-bind:color="props.color"
      class="text-neutral-400 not-dark:text-neutral-500"
      density="default"
      prepend-icon="$plus"
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
import type { TBtn } from "@/utils/vuetify";

const props = withDefaults(defineProps<TBtn & { color?: string }>(), {
   color: "success"
});
</script>
