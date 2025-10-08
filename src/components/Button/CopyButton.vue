<template>
   <v-btn
      v-bind:loading="isLoading"
      v-bind:ripple="false"
      density="compact"
      icon="$copy"
      size="small"
      variant="plain"
      @click="copyHandler" />
</template>

<script lang="ts" setup>
// hooks
const { t } = useI18n();
const snackbarStore = useSnackbarStore();

// states
const model = defineModel({ type: String, default: "" });
const isLoading = ref(false);

const copyHandler = async () => {
   isLoading.value = true;
   try {
      await navigator.clipboard.writeText(model.value);
      snackbarStore.add({ text: t("app.recordSuccess") });
   } catch (error) {
      snackbarStore.error(error || t("app.recordFailed"));
   } finally {
      isLoading.value = false;
   }
};
</script>
