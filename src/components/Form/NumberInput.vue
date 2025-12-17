<template>
   <v-text-field
      v-model="maskedValue"
      v-bind:class="{
         'number-append': props.controlVariant !== 'hidden',
         'number-prepend': props.controlVariant === 'split',
         'number-icon': props.controlVariant === 'split'
      }"
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
            v-press="decreaseHandler"
            class="h-full rounded-none"
            density="compact"
            icon="$expand"
            variant="text"
            @mousedown.stop />
         <v-divider vertical />
         <v-btn
            v-bind:disabled="parseNumber(maskedValue) >= props.max"
            v-bind:ripple="false"
            v-press="increaseHandler"
            class="h-full rounded-none"
            density="compact"
            icon="$collapse"
            variant="text"
            @mousedown.stop />
      </template>

      <template
         v-if="props.controlVariant === 'split'"
         v-slot:prepend-inner>
         <v-btn
            v-bind:disabled="parseNumber(maskedValue) <= props.min"
            v-bind:ripple="false"
            v-press="decreaseHandler"
            class="h-full rounded-none"
            density="compact"
            icon="$minus"
            variant="text"
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
            v-press="increaseHandler"
            class="h-full rounded-none"
            density="compact"
            icon="$plus"
            variant="text"
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
};

// hooks
const i18n = useI18n();

// states
const emits = defineEmits(["update:modelValue"]);
const props = withDefaults(defineProps<TField & TProps>(), {
   controlVariant: "hidden",
   step: 10,
   shiftStep: 0.1,
   min: 0,
   max: Infinity,
   fraction: 2,
   modelValue: 0
});
const locale = ref(getLocale());
const options = computed(() => ({
   number: {
      locale: locale.value,
      fraction: props.fraction,
      unsigned: props.min >= 0
   },
   eager: true
}));
const maskedValue = ref(formatNumber(Number(props.modelValue), props.fraction));
const inputFocused = ref(false);

// handlers
const increaseHandler = (event: MouseEvent) => {
   const value = parseNumber(maskedValue.value);
   let step = props.step;
   if (event.shiftKey && props.shiftStep && props.fraction > 0) {
      step = props.shiftStep;
   }

   maskedValue.value = formatNumber(Math.min(value + step, props.max), props.fraction);
   emits("update:modelValue", parseNumber(maskedValue.value));
};

const decreaseHandler = (event: MouseEvent) => {
   const value = parseNumber(maskedValue.value);
   let step = props.step;
   if (event.shiftKey && props.shiftStep && props.fraction > 0) {
      step = props.shiftStep;
   }

   maskedValue.value = formatNumber(Math.max(value - step, props.min), props.fraction);
   emits("update:modelValue", parseNumber(maskedValue.value));
};

const focusHandler = (event: FocusEvent) => {
   inputFocused.value = true;
   const input = event.target as HTMLInputElement;
   const cursorPos = input.selectionStart || maskedValue.value.length;

   if (cursorPos === maskedValue.value.length) {
      const { decimal } = decimalSeparator(locale.value);
      maskedValue.value = maskedValue.value.replace(new RegExp(`(${decimal}\\d*?)0+$`), "$1");
   }
};

const blurHandler = () => {
   inputFocused.value = false;
   maskedValue.value = formatNumber(Math.min(Math.max(parseNumber(maskedValue.value), props.min), props.max), props.fraction);
   maskedValue.value = suffixNumber(maskedValue.value, props.fraction);
};

watch(
   () => i18n.locale.value,
   (value) => {
      locale.value = value;
      maskedValue.value = formatNumber(Number(props.modelValue), props.fraction);
   }
);

watch(
   () => props.modelValue,
   (value) => {
      if (!inputFocused.value) {
         maskedValue.value = formatNumber(Number(value), props.fraction);
      }
   }
);
</script>
