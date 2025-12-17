<template>
   <draggable
      v-model="model"
      v-bind:fallback-on-body="!props.hideDrag"
      v-bind:force-fallback="!props.hideDrag"
      v-bind:ghost-class="props.hideDrag ? undefined : 'invisible'"
      v-bind:item-key="props.itemKey"
      animation="200"
      group="draggable"
      @end="dragEnd"
      @start="dragStart">
      <template v-slot:item="{ element, index }">
         <div>
            <FallbackAvatar
               v-bind:image="element[props.image]"
               v-bind:on-delete="props.onDelete ? () => props.onDelete?.(element, index) : undefined"
               v-bind:on-edit="props.onEdit ? () => props.onEdit?.(element, index) : undefined"
               v-bind:size="props.size"
               class="border-thin" />
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
   onDelete?: (item: T, index: number) => void;
   onEdit?: (item: T, index: number) => void;
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
   document.documentElement.classList.add("grabbing");
};

const dragEnd = () => {
   document.documentElement.classList.remove("grabbing");
};
</script>
