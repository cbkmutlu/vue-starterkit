<template>
   <v-text-field
      v-model="maskedValue"
      v-bind:class="{ 'field-appended:pe-0': props.controlVariant !== 'hidden' }"
      v-maska="options"
      @blur="blurHandler"
      @focus="focusHandler"
      @update:model-value="emits('update:modelValue', parseNumber($event))">
      <template
         v-if="props.controlVariant === 'default'"
         v-slot:append-inner>
         <v-divider vertical />
         <v-btn
            v-bind:disabled="parseNumber(maskedValue) <= props.min"
            v-bind:ripple="false"
            class="h-full rounded-none"
            density="compact"
            icon="$expand"
            variant="text"
            @click="decreaseHandler"
            @mousedown.stop />
         <v-divider vertical />
         <v-btn
            v-bind:disabled="parseNumber(maskedValue) >= props.max"
            v-bind:ripple="false"
            class="h-full rounded-none"
            density="compact"
            icon="$collapse"
            variant="text"
            @click="increaseHandler"
            @mousedown.stop />
      </template>

      <template
         v-if="props.controlVariant === 'split'"
         v-slot:prepend-inner>
         <v-divider
            class="ms-1"
            vertical />
         <v-btn
            v-bind:disabled="parseNumber(maskedValue) <= props.min"
            v-bind:ripple="false"
            class="h-full rounded-none"
            density="compact"
            icon="$minus"
            variant="text"
            @click="decreaseHandler"
            @mousedown.stop />
         <v-divider vertical />
      </template>
      <template
         v-if="props.controlVariant === 'split'"
         v-slot:append-inner>
         <v-divider vertical />
         <v-btn
            v-bind:disabled="parseNumber(maskedValue) >= props.max"
            v-bind:ripple="false"
            class="h-full rounded-none"
            density="compact"
            icon="$plus"
            variant="text"
            @click="increaseHandler"
            @mousedown.stop />
      </template>

      <template
         v-if="$slots.append"
         v-slot:append>
         <slot name="append" />
      </template>
   </v-text-field>
</template>

<script lang="ts" setup>
import type { TField } from "@/utils/types";
type TProps = {
   controlVariant?: "default" | "split" | "hidden";
   step?: number;
   shiftStep?: number;
   min?: number;
   max?: number;
   fraction?: number;
   modelValue?: number;
   negative?: boolean;
};

// hooks
const i18n = useI18n();

// states
const emits = defineEmits(["update:modelValue"]);
const props = withDefaults(defineProps<TField & TProps>(), {
   controlVariant: "hidden",
   step: 1,
   shiftStep: 0.1,
   min: 0,
   max: Infinity,
   fraction: 2,
   modelValue: 0,
   negative: false
});
const locale = ref(getLocale());
const options = computed(() => ({
   number: {
      locale: locale.value,
      fraction: props.fraction,
      unsigned: !props.negative
   },
   eager: true
}));
const maskedValue = ref(formatNumber(Number(props.modelValue)));

// handlers
const increaseHandler = (event: MouseEvent) => {
   const value = parseNumber(maskedValue.value);
   let step = props.step;
   if (event.shiftKey) {
      step = props.shiftStep;
   }

   maskedValue.value = formatNumber(Math.min(value + step, props.max));
   emits("update:modelValue", parseNumber(maskedValue.value));
};

const decreaseHandler = (event: MouseEvent) => {
   const value = parseNumber(maskedValue.value);
   let step = props.step;
   if (event.shiftKey) {
      step = props.shiftStep;
   }

   maskedValue.value = formatNumber(Math.max(value - step, props.min));
   emits("update:modelValue", parseNumber(maskedValue.value));
};

const focusHandler = (event: FocusEvent) => {
   const input = event.target as HTMLInputElement;
   const cursorPos = input.selectionStart || maskedValue.value.length;

   if (cursorPos === maskedValue.value.length) {
      const { decimal } = decimalSeparator(locale.value);
      maskedValue.value = maskedValue.value.replace(new RegExp(`(${decimal}\\d*?)0+$`), "$1");
   }
};

const blurHandler = () => {
   maskedValue.value = formatNumber(Math.min(Math.max(parseNumber(maskedValue.value), props.min), props.max));
   maskedValue.value = suffixNumber(maskedValue.value, props.fraction);
};

watch(
   () => i18n.locale.value,
   (value) => {
      locale.value = value;
      maskedValue.value = formatNumber(Number(props.modelValue));
   }
);
</script>
