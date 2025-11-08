<template>
   <v-list
      v-bind:slim="false"
      class="mb-4 max-w-full p-0"
      density="default"
      lines="two">
      <v-list-item
         v-for="item in props.data"
         v-bind:active="false"
         v-bind:border="true"
         v-bind:ellipsis="true"
         v-bind:key="(item as any)[props.itemKey]"
         v-bind:ripple="false"
         v-bind:subtitle="(item as any)[props.subtitle]"
         v-bind:title="(item as any)[props.title]"
         v-bind:to="props.to ? { name: props.to, params: { id: (item as any)[props.itemKey] } } : undefined"
         class="not-last:mb-2 last:mb-0">
         <template v-slot:prepend>
            <FallbackAvatar v-bind:image="(item as any)?.[props.image]" />
         </template>

         <template
            v-if="props.onDelete"
            v-slot:append>
            <v-btn
               icon="$close"
               variant="plain"
               @click="props.onDelete?.(item)" />
         </template>
      </v-list-item>
   </v-list>
</template>

<script generic="T" lang="ts" setup>
import FallbackAvatar from "@/components/Avatar/FallbackAvatar.vue";
type TProps = {
   data: T[];
   to?: string;
   title?: string;
   image?: string;
   subtitle?: string | number;
   itemKey?: string;
   onDelete?: (item: T) => void;
};

// states
const props = withDefaults(defineProps<TProps>(), {
   title: "title",
   subtitle: "content",
   itemKey: "id",
   image: "image_path"
});
</script>
