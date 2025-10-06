<template>
   <v-btn
      v-bind:="$attrs"
      v-ripple.stop
      class="opacity-50 hover:!opacity-100"
      density="compact" />
</template>

<script lang="ts" setup>
import type { TBtn } from "@/utils/vuetify";

withDefaults(defineProps<TBtn>(), {});
</script>
