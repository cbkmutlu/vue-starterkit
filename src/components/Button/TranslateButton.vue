<template>
   <v-btn
      v-bind:color="props.color"
      v-bind:loading="isLoading"
      v-bind:ripple="false"
      density="compact"
      icon="$translate"
      size="small"
      variant="plain"
      @click="translateHandler" />
</template>

<script lang="ts" setup>
import type { TBtn } from "@/utils/vuetify";

const model = defineModel({ type: String, default: "" });
const { translate, isLoading } = useGoogleTranslate();

const props = withDefaults(defineProps<TBtn & { color?: string; from?: string; to?: string }>(), {
   color: "primary",
   from: "auto",
   to: "en"
});

const translateHandler = async () => {
   model.value = await translate(model.value, props.from, props.to);
};
</script>
