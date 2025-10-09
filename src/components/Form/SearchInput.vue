<template>
   <div>
      <v-text-field
         v-bind="{ ...$attrs }"
         v-bind:placeholder="t('app.search')"
         append-inner-icon="$search"
         bg-color="surface"
         hide-details
         min-width="250"
         @click:clear="search = ''"
         @input="inputHandler($event)" />
   </div>
</template>

<script lang="ts" setup>
// hooks
const { t } = useI18n();

// states
const search = defineModel("search", { type: String, default: "" });

// handlers
const inputHandler = debounceTimer(async ($event) => {
   search.value = $event.target.value;
});
</script>
