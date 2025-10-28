<template>
   <v-btn
      v-ripple.stop
      class="opacity-50 hover:opacity-100!"
      density="compact" />
</template>

<script lang="ts" setup>
import type { TBtn } from "@/utils/types";

// states
withDefaults(defineProps<TBtn>(), {});
</script>
