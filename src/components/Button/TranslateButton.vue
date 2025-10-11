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
import type { TBtn } from "@/utils/types";
type TProps = {
   color?: string;
   from?: string;
   to?: string;
};

// hooks
const snackbarStore = useSnackbarStore();

// states
const model = defineModel({ type: String, default: "" });
const props = withDefaults(defineProps<TBtn & TProps>(), {
   color: "primary",
   from: "auto",
   to: "en"
});
const { translate, isLoading } = useGoogleTranslate();

// handlers
const translateHandler = async () => {
   try {
      model.value = await translate(model.value, props.from, props.to);
      snackbarStore.success();
   } catch (error) {
      snackbarStore.error(error);
   }
};
</script>
