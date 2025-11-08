<template>
   <div>
      <v-text-field
         v-model="model"
         v-bind="{ ...$attrs }"
         v-bind:placeholder="t('app.search')"
         append-inner-icon="$search"
         bg-color="surface"
         hide-details
         min-width="250"
         @click:clear="clearHandler"
         @input="inputHandler($event)"
         @keydown="keydownHandler($event)" />
   </div>
</template>

<script lang="ts" setup>
import type { TField } from "@/utils/types";

// hooks
const { t } = useI18n();

// states
withDefaults(defineProps<TField>(), {});
const model = defineModel({ type: String, default: "" });

// handlers
const clearHandler = () => {
   model.value = "";
};

const keydownHandler = (event: KeyboardEvent) => {
   if (event.key === "Escape") {
      clearHandler();
      event.stopPropagation();
   }
};

const inputHandler = debounceTimer(async ($event) => {
   model.value = $event.target.value;
});
</script>
