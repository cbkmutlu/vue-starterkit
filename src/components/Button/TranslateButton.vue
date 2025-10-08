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

// hooks
const { t } = useI18n();
const snackbarStore = useSnackbarStore();

// states
const model = defineModel({ type: String, default: "" });
const { translate, isLoading } = useGoogleTranslate();

const props = withDefaults(defineProps<TBtn & { color?: string; from?: string; to?: string }>(), {
   color: "primary",
   from: "auto",
   to: "en"
});

const translateHandler = async () => {
   try {
      model.value = await translate(model.value, props.from, props.to);
      snackbarStore.add({ text: t("app.recordSuccess") });
   } catch (error) {
      snackbarStore.error(error || t("app.recordFailed"));
   }
};
</script>
