<template>
   <v-row v-if="props.items?.[0] !== null && props.items?.[0] !== undefined">
      <v-col
         v-for="(item, index) in props.items"
         v-bind:key="index"
         cols="6"
         md="3"
         sm="4">
         <FallbackAvatar
            v-bind:image="typeof item === 'string' ? item : (item as any)[props.image]"
            v-bind:on-delete="props.onDelete ? () => props.onDelete?.(item) : undefined"
            v-bind:on-edit="props.onEdit ? () => props.onEdit?.(item) : undefined"
            v-bind:size="props.size" />
      </v-col>
   </v-row>
</template>

<script generic="T" lang="ts" setup>
/*
String
data = image1
v-bind:items="[data]"

Array<String>
data = [image1, image2, image3]
v-bind:items="data"

Array<Object>
data = [{ id: number; image_path: string; sort_order: number }]
v-bind:items="data"
v-bind:image="image_path"
 */
import FallbackAvatar from "@/components/Avatar/FallbackAvatar.vue";
type TProps = {
   items: T[];
   image?: string;
   size?: string;
   onDelete?: (item: T) => void;
   onEdit?: (item: T) => void;
};

// states
const props = withDefaults(defineProps<TProps>(), {
   image: "image",
   size: "100%"
});
</script>
