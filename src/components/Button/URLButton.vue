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
const model = defineModel({ type: String, default: "" });
const props = defineProps({
   source: {
      type: String
   }
});
const isLoading = ref(false);

const urlHandler = () => {
   isLoading.value = true;
   const value = props.source ?? model.value;
   model.value = createSlug(value);
   isLoading.value = false;
};
</script>
