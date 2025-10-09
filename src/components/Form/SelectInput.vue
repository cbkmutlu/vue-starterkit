<template>
   <v-select
      v-model="model"
      v-bind="{ ...$attrs }"
      v-bind:item-title="props.itemTitle"
      v-bind:items="items"
      v-bind:loading="props.loading"
      v-bind:menu-props="{ maxHeight: 320 }"
      v-bind:multiple="props.multiple"
      v-bind:open-on-clear="props.openOnClear"
      transition="dialog-transition"
      @click:clear="clearHandler()"
      @update:menu="$event && clearHandler()">
      <template v-slot:prepend-item>
         <v-list-item
            v-if="props.search"
            v-bind:link="false"
            class="mb-0 px-0">
            <v-list-item-title>
               <v-text-field
                  v-model="search"
                  hide-details
                  @click:clear="clearHandler()"
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
                  class="me-2"
                  density="compact"
                  tabindex="-1"
                  @update:model-value="selectAll(!allSelected)" />
            </template>
            <v-list-item-title>
               {{ t("app.selectAll") }}
            </v-list-item-title>
         </v-list-item>

         <v-divider class="my-2"></v-divider>
      </template>

      <template v-slot:item="{ item, props: itemProps }">
         <v-list-item v-bind="itemProps">
            <template
               v-if="props.multiple"
               v-slot:prepend="{ isSelected }">
               <v-checkbox-btn
                  v-bind:model-value="isSelected"
                  v-bind:ripple="false"
                  class="me-2"
                  density="compact"
                  tabindex="-1" />
            </template>

            <template v-slot:title>
               <slot
                  v-bind:item="item"
                  name="title">
                  {{ item.title }}
               </slot>
            </template>

            <template v-slot:subtitle>
               <slot
                  v-bind:item="item"
                  name="subtitle" />
            </template>
         </v-list-item>
      </template>

      <template v-slot:selection="{ item, index }">
         <template v-if="index === 0 && model.length > props.count && props.count > 0">
            <v-chip
               class="mr-1"
               color="primary"
               density="compact"
               variant="tonal">
               {{ model.length }}
            </v-chip>
         </template>

         <template v-if="index < props.count || props.count === 0">
            <span class="v-select__selection-text">
               <slot
                  v-bind:item="item"
                  name="selection">
                  {{ item.title }}
               </slot>
               <template v-if="index < model.length - 1 && (index < props.count - 1 || props.count === 0)">
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
            <v-list-item v-bind:link="false">
               <v-list-item-title>
                  <slot name="no-data-title">{{ props.noDataText || t("app.noData") }}</slot>
               </v-list-item-title>
               <v-list-item-subtitle>
                  <slot name="no-data-subtitle" />
               </v-list-item-subtitle>
               <template v-slot:append>
                  <slot name="no-data-append" />
               </template>
            </v-list-item>
         </slot>
      </template>
   </v-select>
</template>

<script lang="ts" setup>
import type { TMultiSelect } from "@/utils/types";
type TProps = {
   items?: any[];
   count?: number;
   search?: boolean;
   searchDeep?: boolean;
   searchItem?: string[];
   multiple?: boolean;
   openOnClear?: boolean;
   menuProps?: any;
   loading?: boolean;
   itemTitle?: string;
   noDataText?: string;
};

// hooks
const { t } = useI18n();

// states
const model = defineModel({ type: [Array, Object, Number, null], default: null });
const search = defineModel("search", { type: String, default: "" });
const props = withDefaults(defineProps</* @ts-ignore */TMultiSelect & TProps>(), {
   count: 2,
   search: true,
   searchDeep: false,
   multiple: false,
   openOnClear: true,
   loading: false,
   itemTitle: "title"
});
const debounce = ref("");
const items = computed(() => {
   return props.items?.filter((item: any) => {
      let value = lowerCase(debounce.value.toString());

      if (props.searchDeep) {
         return !(value && !searchString(Object.values(item).join(" ").toString(), value));
      }
      if (props.searchItem) {
         return !(value && !searchString(props.searchItem.map((title: any) => item[title]).join(" "), value));
      }
      return !(value && !searchString(item[props.itemTitle].toString(), value));
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
   search.value = "";
};

const inputHandler = debounceTimer(async ($event) => {
   debounce.value = $event.target.value;
});

const keydownHandler = (event: KeyboardEvent) => {
   if (event.key === "Escape") {
      if (search.value) {
         clearHandler();
         event.stopPropagation();
      }
   } else if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      event.stopPropagation();
   }
};
</script>
