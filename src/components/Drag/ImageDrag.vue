<template>
   <draggable
      v-model="model"
      v-bind:fallback-on-body="!props.hideDrag"
      v-bind:force-fallback="!props.hideDrag"
      v-bind:ghost-class="props.hideDrag ? undefined : 'invisible'"
      v-bind:item-key="props.itemKey"
      animation="200"
      group="draggable"
      @start="dragStart">
      <template v-slot:item="{ element }">
         <div>
            <FallbackAvatar
               v-bind:image="element[props.image]"
               v-bind:on-delete="props.onDelete ? () => props.onDelete?.(element) : undefined"
               v-bind:on-edit="props.onEdit ? () => props.onEdit?.(element) : undefined"
               v-bind:size="props.size" />
         </div>
      </template>
   </draggable>
</template>

<script generic="T" lang="ts" setup>
import draggable from "vuedraggable";
import FallbackAvatar from "../Avatar/FallbackAvatar.vue";
type TProps = {
   hideDrag?: boolean;
   itemKey?: string;
   size?: string;
   image?: string;
   onDelete?: (item: T) => void;
   onEdit?: (item: T) => void;
};

// states
const model = defineModel<T[]>({ type: Array });
const props = withDefaults(defineProps<TProps>(), {
   hideDrag: false,
   itemKey: "id",
   size: "40",
   image: "image"
});

// handlers
const dragStart = (e: any) => {
   if (props.hideDrag) {
      dragHide(e);
   }
};
</script>
