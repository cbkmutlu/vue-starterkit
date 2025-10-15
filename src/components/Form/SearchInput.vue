<template>
   <div>
      <v-text-field
         v-bind="{ ...$attrs }"
         v-bind:placeholder="t('app.search')"
         append-inner-icon="$search"
         bg-color="surface"
         hide-details
         min-width="250"
         @click:clear="model = ''"
         @input="inputHandler($event)" />
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
const inputHandler = debounceTimer(async ($event) => {
   model.value = $event.target.value;
});
</script>
