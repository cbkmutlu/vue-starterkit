<template>
   <draggable
      v-model="model"
      v-bind:fallback-on-body="!props.hideDrag"
      v-bind:force-fallback="!props.hideDrag"
      v-bind:ghost-class="props.hideDrag ? undefined : 'invisible'"
      v-bind:handle="props.handle || undefined"
      v-bind:item-key="props.itemKey"
      animation="200"
      group="draggable"
      @end="dragEnd"
      @start="dragStart">
      <template v-slot:item="{ element, index }">
         <div class="drag-list bg-theme border-emphasis border-b not-last:mb-1 last:border-b-transparent">
            <slot
               v-bind:element="{ ...(element as T) }"
               v-bind:index="index"
               name="item">
               <v-list-item>
                  <template
                     v-if="props.prepend"
                     v-slot:prepend>
                     <slot
                        v-bind:element="{ ...(element as T) }"
                        v-bind:index="index"
                        name="prepend">
                        <FallbackAvatar v-bind:image="element[props.image]" />
                     </slot>
                  </template>
                  <template
                     v-if="props.append"
                     v-slot:append>
                     <slot
                        v-bind:element="{ ...(element as T) }"
                        v-bind:index="index"
                        name="append">
                        <div class="list-action not-grabbing:[.v-list-item:hover_.list-action]:opacity-100 flex w-22.5 items-center justify-end gap-1 opacity-0 transition-opacity">
                           <slot
                              v-if="props.appendAction"
                              v-bind:element="{ ...(element as T) }"
                              v-bind:index="index"
                              name="append.action">
                              <v-chip
                                 v-if="props.showOrder === true || props.showOrder > index"
                                 density="comfortable"
                                 variant="plain">
                                 {{ index + 1 }}
                              </v-chip>
                              <v-btn
                                 v-if="props.onEdit"
                                 density="compact"
                                 icon="$edit"
                                 variant="plain"
                                 @click="props.onEdit(element)" />
                              <v-btn
                                 v-if="props.onDelete"
                                 density="compact"
                                 icon="$trash"
                                 variant="plain"
                                 @click="props.onDelete(element)" />
                           </slot>
                        </div>
                        <slot
                           v-if="props.appendHandle"
                           name="append.handle">
                           <v-divider
                              class="mx-2"
                              vertical />
                           <v-icon
                              class="handle not-grabbing:cursor-n-resize"
                              density="compact"
                              icon="$dotsVertical"
                              size="small" />
                        </slot>
                     </slot>
                  </template>

                  <slot
                     v-bind:element="{ ...(element as T) }"
                     v-bind:index="index"
                     name="title">
                     <v-list-item-title v-if="element[props.title] && props.title">{{ element[props.title] }}</v-list-item-title>
                     <v-list-item-subtitle v-if="element[props.subtitle] && props.subtitle">{{ element[props.subtitle] }}</v-list-item-subtitle>
                  </slot>
               </v-list-item>
            </slot>
         </div>
      </template>
   </draggable>
</template>

<script generic="T" lang="ts" setup>
import FallbackAvatar from "@/components/Avatar/FallbackAvatar.vue";
import draggable from "vuedraggable";
type TProps = {
   prepend?: boolean;
   append?: boolean;
   appendAction?: boolean;
   appendHandle?: boolean;
   hideDrag?: boolean;
   title?: string;
   subtitle?: string;
   image?: string;
   itemKey?: string;
   showOrder?: boolean | number;
   handle?: false | string;
   onDelete?: (item: T) => void;
   onEdit?: (item: T) => void;
};

// states
const model = defineModel<T[]>({ type: Array });
const props = withDefaults(defineProps<TProps>(), {
   prepend: true,
   append: true,
   appendAction: true,
   appendHandle: true,
   hideDrag: false,
   title: "name",
   subtitle: "description",
   image: "image",
   itemKey: "id",
   showOrder: false,
   handle: ".handle"
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
