<template>
   <v-btn
      v-bind:loading="isLoading"
      v-bind:ripple="false"
      density="compact"
      icon="$link"
      size="small"
      variant="plain"
      @click="urlHandler" />
</template>

<script lang="ts" setup>
// states
const model = defineModel({ type: String });
const isLoading = ref(false);

// handlers
const urlHandler = () => {
   isLoading.value = true;
   model.value = createSlug(model.value || "");
   isLoading.value = false;
};
</script>
