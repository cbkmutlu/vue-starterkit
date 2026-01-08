<template>
   <div>
      <v-text-field
         v-model="filterRaw"
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
type TProps = {
   timer?: "debounce" | "throttle";
   delay?: number;
   leading?: boolean;
   trailing?: boolean;
};

// hooks
const { t } = useI18n();

// states
const props = withDefaults(defineProps<TField & TProps>(), {
   timer: "debounce",
   delay: 350,
   leading: true,
   trailing: true
});

const model = defineModel({ type: String, default: "" });
const filterRaw = defineModel("filterRaw", { type: String, default: "" });

// handlers
const clearHandler = () => {
   filterRaw.value = "";
   model.value = "";
};

const keydownHandler = (event: KeyboardEvent) => {
   if (event.key === "Escape") {
      clearHandler();
      event.stopPropagation();
   }
};

const inputHandler = (props.timer === "throttle" ? throttleTimer : debounceTimer)(
   async ($event: Event) => {
      model.value = ($event.target as HTMLInputElement).value;
   },
   props.delay,
   { leading: props.leading, trailing: props.trailing }
);
</script>
