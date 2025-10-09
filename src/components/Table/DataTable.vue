<template>
   <v-data-table
      v-bind="{ ...$attrs }"
      v-bind:class="{
         'v-table--sticky-header': props.stickyHeader,
         'v-table--sticky-footer': props.stickyFooter,
         'v-table--accent-header': props.accentHeader
      }"
      v-bind:headers="props.headers"
      v-bind:items="items"
      v-bind:items-per-page-options="[10, 25, 50, 100, -1]"
      v-bind:loading="props.loading || optionsLoading"
      density="compact"
      hover
      items-per-page="25"
      return-object
      @update:options="optionsUpdateHandler"
      @update:page="expandedItems = []">
      <template v-slot:loading>
         <slot name="loading">
            <v-skeleton-loader v-bind:type="props.skeleton" v-bind:boilerplate="getMotionReduction()" />
         </slot>
      </template>

      <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort, someSelected, allSelected, selectAll }">
         <TableHeader v-bind="{ columns, isSorted, getSortIcon, toggleSort, someSelected, allSelected, selectAll, disableSort }" />
      </template>

      <template
         v-if="!props.loading"
         v-slot:body="{ internalItems, isSelected, toggleSelect, columns }: BodySlotScope<T>">
         <v-fade-transition
            group
            hide-on-leave>
            <template
               v-for="(item, itemIndex) in internalItems"
               :key="itemIndex">
               <tr
                  v-bind:class="[{ 'v-data-table__tr--clickable': rowClick || props.expandOnClick }, { 'v-data-table__tr--sticky': isExpanded(item) && props.accentOnExpand }]"
                  v-ripple="props.ripple && (rowClick || props.expandOnClick)"
                  class="v-data-table__tr"
                  @click="() => rowClickHandler(item)">
                  <template v-for="(column, index) in Object.keys(item.columns)">
                     <td
                        v-if="column === 'data-table-select'"
                        class="v-data-table__td v-data-table-column--no-padding v-data-table-column--align-start v-data-table__td--select-row">
                        <v-checkbox-btn
                           v-bind:disabled="!item.selectable"
                           v-bind:model-value="isSelected(item)"
                           v-ripple.stop
                           class="text-base"
                           @click.stop="toggleSelect(item)" />
                     </td>

                     <td
                        v-else-if="column === 'data-table-expand'"
                        class="v-data-table__td v-data-table-column--no-padding v-data-table-column--align-start v-data-table__td--expanded-row">
                        <div class="flex justify-end">
                           <v-btn
                              v-ripple.stop
                              density="compact"
                              icon
                              @click.stop="toggleExpand(item)">
                              <v-icon
                                 v-bind:class="{ 'rotate-180': isExpanded(item) }"
                                 class="transition duration-150"
                                 icon="$expand" />
                           </v-btn>

                           <slot name="action" />
                        </div>
                     </td>

                     <td
                        v-else
                        v-bind:class="`v-data-table-column--align-${columns[index].align || 'start'}`"
                        v-bind:data-label="columns[index].title"
                        class="v-data-table__td">
                        <template v-if="column === 'actions'">
                           <div class="table-action flex justify-between opacity-0 transition-opacity [tr:hover_.table-action]:!opacity-100">
                              <slot
                                 v-bind:index="itemIndex"
                                 v-bind:item="{ ...(item.value as T) }"
                                 name="item.actions" />
                           </div>
                        </template>

                        <slot
                           v-else
                           v-bind:item="{ ...(item.value as T) }"
                           v-bind:name="`item.${column}`">
                           <template v-if="columns[index].date">
                              {{ date.format(new Date(item.columns[column]), columns[index].date) }}
                           </template>
                           <template v-else>
                              {{ item.columns[column] }}
                           </template>
                        </slot>
                     </td>
                  </template>
               </tr>

               <tr
                  v-if="isExpanded(item)"
                  v-bind:key="`expand-${item.value.id}`"
                  class="v-data-table__tr--expand v-data-table__tr">
                  <td
                     v-bind:colspan="columns.length"
                     class="v-data-table__td v-data-table-column--no-padding">
                     <slot
                        v-bind:item="{ ...(item.value as T) }"
                        name="expand" />
                  </td>
               </tr>
            </template>
         </v-fade-transition>
      </template>

      <template v-slot:body.prepend>
         <slot name="prepend" />
      </template>
      <template v-slot:body.append>
         <slot name="append" />
      </template>
   </v-data-table>
</template>

<style>
@media screen and (max-width: 600px) {
   .v-data-table td {
      position: relative;
      /* display: inline-flex; */
      display: flex;
      /* align-items: flex-end; */
      align-items: center;
      justify-content: flex-end;
      /* width: 50%; */
   }

   .v-data-table td::before {
      content: attr(data-label);
      position: absolute;
      left: 8px;
      top: 0;
      font-size: 12px;
      /* line-height: 2em; */
      opacity: 0.5;

      display: flex;
      align-items: center;
      height: 100%;
   }

   .v-data-table tr {
      border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity));
   }

   .v-data-table td {
      border-bottom: 0;
   }
}
</style>

<script generic="T" lang="ts" setup>
import TableHeader from "@/components/Table/TableHeader.vue";
import type { TDataTable } from "@/utils/types";
import { SelectableItem } from "vuetify/lib/components/VDataTable/composables/select.mjs";
import { DataTableItem, InternalDataTableHeader } from "vuetify/lib/components/VDataTable/types.mjs";
type BodySlotScope<T> = {
   internalItems: readonly DataTableItem<T>[];
   isSelected: (item: SelectableItem) => boolean;
   toggleSelect: (item: SelectableItem, index?: number, event?: MouseEvent) => void;
   columns: InternalDataTableHeader[] & { date?: string }[];
};
type TProps<T> = {
   items?: T[];
   stickyHeader?: boolean;
   stickyFooter?: boolean;
   accentHeader?: boolean;
   disableSort?: boolean;
   multiExpand?: boolean;
   loading?: boolean;
   filter?: string;
   headers?: THeader<T>[];
   ripple?: boolean;
   skeleton?: string;
   expandOnClick?: boolean;
   accentOnExpand?: boolean;
};

// hooks
const date = useDate();

// states
const props = withDefaults(defineProps<TDataTable & TProps<T>>(), {
   stickyHeader: true,
   stickyFooter: true,
   accentHeader: false,
   filter: "",
   ripple: false,
   accentOnExpand: true,
   skeleton: "table-row-divider, list-item-three-line, list-item-two-line, list-item-two-line"
});
const items = computed(() => {
   const filter = lowerCase(props.filter);
   const keys = props.headers?.map((h) => h.key);

   if (!props.items || !Array.isArray(props.items)) {
      return [];
   }

   return props.items
      .map((item) => {
         const headers = lowerCase(keys?.map((key: any) => key.split(".").reduce((acc: any, cur: any) => acc[cur], item)).join(" "));
         return { ...item, headers };
      })
      .filter((item) => {
         if (!filter) {
            return true;
         }
         return searchString(item.headers, filter);
      });
});
const emit = defineEmits<{
   (event: "row:click", item: T, index: number): void;
   (event: "row:expand", item: T, index: number): void;
}>();
const expandedItems: any = ref([]);
const optionsLoading = ref(false);
const currentOptions: any = ref({});
const rowClick = !!getCurrentInstance()?.vnode.props?.["onRow:click"];

// handlers
const isExpanded = (item: any) => expandedItems.value.includes(item);
const toggleExpand = (item: any, multiple: boolean = props.multiExpand) => {
   if (multiple) {
      if (isExpanded(item)) {
         expandedItems.value.splice(expandedItems.value.indexOf(item), 1);
      } else {
         expandedItems.value.push(item);
      }
   } else {
      expandedItems.value = isExpanded(item) ? [] : [item];
   }
   emit("row:expand", item.value, item.index);
};

const optionsUpdateHandler = async (options: any) => {
   if (options.itemsPerPage !== currentOptions.value.itemsPerPage) {
      optionsLoading.value = true;
      await nextTick();
   }

   setTimeout(() => (optionsLoading.value = false), 25);
   currentOptions.value = options;
};

const rowClickHandler = (item: DataTableItem) => {
   if (props.expandOnClick) {
      toggleExpand(item);
   }
   emit("row:click", item.value, item.index);
};
</script>
