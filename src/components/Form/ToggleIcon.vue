<template>
   <v-fade-transition leave-absolute>
      <v-icon
         v-bind:icon="icon"
         v-bind:size="props.size" />
   </v-fade-transition>
</template>

<script lang="ts" setup>
// states
const props = defineProps({
   icon: {
      type: Array as () => string[],
      required: true
   },
   toggle: {
      type: [Boolean, String],
      required: true
   },
   list: {
      type: Array as () => string[]
   },
   size: {
      type: String,
      default: "small"
   }
});
const icon = computed(() => {
   if (props.list) {
      return props.icon[props.list.indexOf(props.toggle as string)];
   }

   return props.icon[props.toggle ? 0 : 1];
});
</script>
