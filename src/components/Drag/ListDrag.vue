<template>
   <draggable
      v-model="model"
      v-bind:fallback-on-body="!props.hideDrag"
      v-bind:force-fallback="!props.hideDrag"
      v-bind:ghost-class="props.hideDrag ? undefined : 'invisible'"
      v-bind:multidrag="true"
      animation="200"
      group="draggable"
      handle=".handle"
      item-key="id"
      @end="dragEnd"
      @start="dragStart">
      <template v-slot:item="{ element, index }">
         <v-list-item
            v-bind:key="element.id"
            class="bg-surface rounded-none border border-x-transparent border-t-transparent last:border-b-transparent">
            <template
               v-if="props.prepend"
               v-slot:prepend>
               <slot
                  v-bind:element="{ ...(element as T) }"
                  v-bind:index="index"
                  name="prepend">
                  <FallbackAvatar
                     :image="element.image"
                     icon-size="32"
                     size="36" />
               </slot>
            </template>
            <template
               v-if="props.append"
               v-slot:append>
               <slot
                  v-bind:element="{ ...(element as T) }"
                  v-bind:index="index"
                  name="append">
                  <div class="list-action items-center not-grabbing:[.v-list-item:hover_.list-action]:opacity-100 flex w-[90px] justify-between opacity-0 transition-opacity">
                     <slot
                        v-bind:element="{ ...(element as T) }"
                        v-bind:index="index"
                        name="action" />
                  </div>
                  <v-divider
                     class="mx-2"
                     vertical />
                  <v-icon
                     class="handle cursor-grab"
                     density="compact"
                     icon="$dotsVertical"
                     size="small" />
               </slot>
            </template>

            <slot
               v-bind:element="{ ...(element as T) }"
               v-bind:index="index"
               name="title">
               <v-list-item-title v-if="element.name">{{ element.name }}</v-list-item-title>
               <v-list-item-subtitle v-if="element.description">{{ element.description }}</v-list-item-subtitle>
            </slot>
         </v-list-item>
      </template>
   </draggable>
</template>

<style lang="scss" scoped>
.sortable-fallback {
   opacity: 1 !important;
}

// elevation-2
.sortable-chosen {
   border-radius: 4px;
   box-shadow:
      0px 3px 1px -2px rgba(0, 0, 0, 0.2),
      0px 2px 2px 0px rgba(0, 0, 0, 0.14),
      0px 1px 5px 0px rgba(0, 0, 0, 0.12) !important;
}
</style>

<script generic="T" lang="ts" setup>
import FallbackAvatar from "@/components/Avatar/FallbackAvatar.vue";
import draggable from "vuedraggable";

// states
const model = defineModel<T[]>({ type: Array });
const props = defineProps({
   prepend: {
      type: Boolean,
      default: true
   },
   append: {
      type: Boolean,
      default: true
   },
   hideDrag: {
      type: Boolean,
      default: false
   }
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
