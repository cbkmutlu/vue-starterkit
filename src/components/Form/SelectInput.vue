<template>
   <v-select
      v-model="model"
      v-bind:item-title="props.itemTitle"
      v-bind:items="items"
      v-bind:list-props="{ class: props.filter || props.multiple ? 'pt-0' : '' }"
      v-bind:loading="props.loading"
      v-bind:menu-props="{ maxHeight: 320, width: 224 }"
      v-bind:multiple="props.multiple"
      v-bind:open-on-clear="props.openOnClear"
      item-value="id"
      transition="dialog-transition"
      @click:clear="clearHandler"
      @update:menu="!$event && clearHandler()">
      <template v-slot:prepend-item>
         <div
            v-if="props.filter || props.multiple"
            class="bg-surface sticky top-0 z-10 pt-2">
            <v-list-item
               v-if="props.filter"
               v-bind:link="false"
               class="mb-0 px-0">
               <v-list-item-title>
                  <v-text-field
                     v-model="filterRaw"
                     autofocus
                     hide-details
                     @click:clear="clearHandler"
                     @input="inputHandler($event)"
                     @keydown="keydownHandler($event)"
                     @keydown.space.stop
                     @mousedown.stop>
                     <template v-slot:append-inner>
                        <v-icon>$search</v-icon>
                     </template>
                  </v-text-field>
               </v-list-item-title>
            </v-list-item>

            <v-list-item
               v-if="props.multiple"
               class="mb-0"
               @click="selectAll(!allSelected)">
               <template
                  v-if="props.multiple"
                  v-slot:prepend>
                  <v-checkbox-btn
                     v-bind:indeterminate="someSelected && !allSelected"
                     v-bind:model-value="allSelected"
                     v-bind:ripple="false"
                     class="me-1"
                     density="compact"
                     tabindex="-1"
                     @update:model-value="selectAll(!allSelected)" />
               </template>
               <v-list-item-title>
                  {{ t("app.selectAll") }}
               </v-list-item-title>
            </v-list-item>

            <v-divider
               v-if="props.filter"
               class="my-1"></v-divider>
         </div>
      </template>

      <template v-slot:item="{ item, props: itemProps }">
         <v-list-item v-bind="itemProps">
            <template
               v-if="props.multiple"
               v-slot:prepend="{ isSelected }">
               <v-checkbox-btn
                  v-bind:model-value="isSelected"
                  v-bind:ripple="false"
                  class="me-1"
                  density="compact"
                  tabindex="-1" />
            </template>

            <template v-slot:title>
               <slot
                  v-bind:item="{ ...(item.raw as T) }"
                  name="title">
                  <template v-if="props.avatarImage">
                     <FallbackAvatar
                        v-bind:image="item.raw[props.avatarImage]"
                        v-bind:size="props.avatarSize"
                        class="me-1" />
                  </template>
                  {{ item.title }}
               </slot>
            </template>

            <template
               v-if="$slots.subtitle"
               v-slot:subtitle>
               <slot
                  v-bind:item="{ ...(item.raw as T) }"
                  name="subtitle" />
            </template>
         </v-list-item>
      </template>

      <template v-slot:selection="{ item, index }">
         <template v-if="index === 0 && model.length > props.count && props.count > 0 && typeof model !== 'string'">
            <v-chip
               class="mr-1 min-w-8 justify-center"
               color="primary"
               density="default"
               variant="tonal">
               {{ model.length }}
            </v-chip>
         </template>

         <template v-if="index < props.count || props.count === 0">
            <span class="v-select__selection-text">
               <slot
                  v-bind:item="{ ...(item.raw as T) }"
                  name="selection">
                  {{ item.title }}
               </slot>
               <template v-if="index < model.length - 1 && (index < props.count - 1 || props.count === 0) && typeof model !== 'string'">
                  <span class="v-select__selection-comma">,</span>
               </template>
            </span>
         </template>
      </template>

      <template
         v-if="$slots.append"
         v-slot:append>
         <slot name="append" />
      </template>

      <template v-slot:no-data>
         <slot name="no-data">
            <v-list-item
               v-bind:link="false"
               class="mb-0">
               <v-list-item-title>
                  <slot name="no-data-title">{{ props.noDataText || t("app.noData") }}</slot>
               </v-list-item-title>
               <v-list-item-subtitle>
                  <slot name="no-data-subtitle" />
               </v-list-item-subtitle>
               <template v-slot:append>
                  <slot name="no-data-append">
                     <v-btn
                        v-if="props.onEmpty"
                        v-bind:text="t('app.add')"
                        color="primary"
                        density="comfortable"
                        prepend-icon="$plus"
                        @click="props.onEmpty" />
                  </slot>
               </template>
            </v-list-item>
         </slot>
      </template>
   </v-select>
</template>

<script generic="T" lang="ts" setup>
import type { TMultiSelect } from "@/utils/types";
import FallbackAvatar from "../Avatar/FallbackAvatar.vue";
type TProps = {
   items?: T[];
   count?: number;
   filter?: boolean | string[];
   filterDeep?: boolean;
   multiple?: boolean;
   openOnClear?: boolean;
   menuProps?: any;
   loading?: boolean;
   itemTitle?: string;
   noDataText?: string;
   avatarImage?: string;
   avatarSize?: string;
   onEmpty?: () => void;
};

// hooks
const { t } = useI18n();

// states
const model = defineModel({ type: [Array, Object, Number, String, null], default: null });
const filterRaw = defineModel("filterRaw", { type: String, default: "" });
const props = withDefaults(defineProps</* @ts-ignore */ TMultiSelect & TProps>(), {
   filter: true,
   filterDeep: false,
   count: 2,
   multiple: false,
   openOnClear: true,
   loading: false,
   itemTitle: "title",
   avatarSize: "32"
});
const debounce = ref("");
const items = computed(() => {
   const query = debounce.value;
   if (!query) {
      return props.items;
   }

   return props.items?.filter((item) => {
      let data: any[];

      if (props.filterDeep) {
         data = Object.values(item).flatMap((v) => (v && typeof v === "object" ? Object.values(v) : v));
      } else {
         if (Array.isArray(props.filter)) {
            data = props.filter.map((title) => title.split(".").reduce((acc, cur) => acc?.[cur], item));
         } else {
            data = [item[props.itemTitle]];
         }
      }

      return searchString(query, data.join(" "));
   });
});
const allSelected = computed(() => model.value && model.value.length === items.value?.length);
const someSelected = computed(() => model.value && model.value.length > 0);

// handlers
const selectAll = (value: boolean) => {
   model.value = value ? items.value?.slice() : [];
};

const clearHandler = () => {
   debounce.value = "";
   filterRaw.value = "";
};

const keydownHandler = (event: KeyboardEvent) => {
   if (event.key === "Escape") {
      if (filterRaw.value) {
         clearHandler();
         event.stopPropagation();
      }
   } else if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      event.stopPropagation();
   }
};

const inputHandler = debounceTimer(async ($event) => {
   debounce.value = $event.target.value;
});
</script>
