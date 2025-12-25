<template>
   <v-list-subheader
      v-if="props.item.type === 'subheader' && props.item.title"
      class="px-2 font-semibold first:mb-2">
      {{ t(props.item.title as string, 2) }}
   </v-list-subheader>

   <v-divider
      v-else-if="props.item.type === 'divider'"
      class="my-1" />

   <v-list-item
      v-else
      v-bind="props.item.props">
      <template v-slot:append="{ isOpen }">
         <v-icon
            v-if="props.item.children"
            v-bind:class="{ 'rotate-180': isOpen }"
            class="transition duration-200"
            icon="$dropdown"
            size="x-small" />
      </template>

      <template v-slot:prepend>
         <v-icon
            v-if="props.item.props?.prependIcon"
            v-bind:icon="props.item.props?.prependIcon"
            class="list-spacer-3" />
      </template>

      <v-list-item-title v-if="props.item.title">
         {{ typeof props.item.title === "function" ? props.item.title() : t(props.item.title as string) }}
      </v-list-item-title>
      <v-list-item-subtitle v-if="props.item.subtitle">
         {{ typeof props.item.subtitle === "function" ? props.item.subtitle() : t(props.item.subtitle as string) }}
      </v-list-item-subtitle>
   </v-list-item>
</template>

<script lang="ts" setup>
import type { TList } from "@/utils/types";

// hooks
const { t } = useI18n();

// states
const props = defineProps({
   item: { type: Object as () => TList, required: true }
});
</script>
