<template>
   <div class="laptop:grid-cols-12 m-auto mb-2 grid h-auto max-w-fit grid-cols-6">
      <v-btn
         v-for="item in items"
         v-bind="{ ...$attrs }"
         v-bind:active="model.includes(item.id)"
         v-bind:key="item.id"
         v-tooltip:top="item[props.tooltip]"
         class="h-auto min-w-0 p-2 [&.v-btn--active:not(:hover)>.v-btn\_\_overlay]:opacity-0! [&:not(.v-btn--active)_.v-img]:opacity-50 [&:not(.v-btn--active)_.v-img]:grayscale"
         density="default"
         @click="toggleHandler(item)">
         <FallbackAvatar
            v-bind:image="item.image"
            v-bind:style="{ 'background-color': 'transparent' }"
            size="40" />
      </v-btn>
   </div>
</template>

<script lang="ts" setup>
import FallbackAvatar from "@/components/Avatar/FallbackAvatar.vue";
import type { TBtn } from "@/utils/types";

type TProps = {
   items: any[];
   tooltip?: string;
};

// states
const model = defineModel({ type: Array, default: [] });
const props = withDefaults(defineProps<TBtn & TProps>(), {
   tooltip: "name"
});

// handlers
const toggleHandler = (item: any) => {
   const index = model.value.indexOf(item.id);
   if (index === -1) {
      model.value.push(item.id);
   } else {
      model.value.splice(index, 1);
   }
};
</script>
