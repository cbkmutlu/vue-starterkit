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
         @input="inputFilter($event)" />
   </div>
</template>

<script lang="ts" setup>
const { t } = useI18n();

const search = defineModel("search", { type: String, default: "" });

const inputFilter = debounceTimer(async ($event) => {
   search.value = $event.target.value;
});
</script>
