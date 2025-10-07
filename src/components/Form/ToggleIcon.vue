<template>
   <v-fade-transition leave-absolute>
      <v-icon
         v-bind:icon="currentIcon"
         v-bind:size="props.size" />
   </v-fade-transition>
</template>

<script lang="ts" setup>
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

const currentIcon = computed(() => {
   if (props.list) {
      return props.icon[props.list.indexOf(props.toggle as string)];
   }

   return props.icon[props.toggle ? 0 : 1];
});
</script>
