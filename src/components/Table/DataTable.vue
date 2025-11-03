<template>
   <v-data-table
      v-bind:class="{
         // 'v-table--sticky-header': props.stickyHeader,
         // 'v-table--sticky-footer': props.stickyFooter,
         'v-table--accent-header': props.accentHeader
      }"
      v-bind:headers="props.headers"
      v-bind:items="items"
      v-bind:items-per-page-options="[10, 25, 50, 100, -1]"
      v-bind:loading="props.loading || optionsLoading"
      v-bind:sortBy="props.sortBy"
      density="compact"
      hover
      items-per-page="25"
      return-object
      @update:options="optionsUpdateHandler"
      @update:page="expandedItems = []">
      <template v-slot:colgroup="{ columns }">
         <colgroup>
            <template v-for="column in columns">
               <col
                  v-if="column.key === 'data-table-select' || column.key === 'data-table-expand'"
                  v-bind:style="{ width: '54px' }" />
               <col
                  v-else-if="column.key === 'actions'"
                  v-bind:style="{ width: (column.width ? Number(column.width) + 24 : 54) + 'px' }" />
               <col
                  v-else
                  v-bind:style="[{ width: column.width ? column.width + 'px' : 'auto' }, { minWidth: (column.minWidth ? column.minWidth : column.width ? column.width : 120) + 'px' }]" />
            </template>
         </colgroup>
      </template>

      <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort, someSelected, allSelected, selectAll }">
         <TableHeader v-bind="{ columns, isSorted, getSortIcon, toggleSort, someSelected, allSelected, selectAll, disableSort }" />
      </template>

      <template v-slot:loading>
         <slot name="loading">
            <v-skeleton-loader
               v-bind:boilerplate="getMotionReduction()"
               v-bind:type="props.skeleton" />
         </slot>
      </template>

      <template v-slot:body.prepend>
         <slot name="body.prepend" />
      </template>

      <template v-slot:body.append>
         <slot name="body.append" />
      </template>

      <template
         v-if="!props.loading"
         v-slot:body="{ internalItems, isSelected, toggleSelect, columns }: BodySlotScope<T>">
         <v-fade-transition
            name="motion-row"
            group
            hide-on-leave>
            <slot name="no-data">
               <tr v-if="!internalItems.length">
                  <td
                     v-bind:colspan="columns.length"
                     class="v-data-table__td v-data-table-column--no-padding"
                     align="center">
                     {{ props.noDataText || t("app.noData") }}
                  </td>
               </tr>
            </slot>
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
                           <div class="table-action flex justify-between opacity-0 transition-opacity [tr:hover>td>.table-action]:opacity-100">
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
                              {{ item.columns[column] && date.format(new Date(item.columns[column]), columns[index].date) }}
                           </template>
                           <template v-else-if="columns[index].format">
                              <template v-if="columns[index].prefix">
                                 {{ columns[index].prefix }}
                              </template>
                              {{ columns[index].format(item.columns[column]) }}
                              <template v-if="columns[index].suffix">
                                 {{ columns[index].suffix }}
                              </template>
                           </template>
                           <template v-else-if="columns[index].prefix">{{ columns[index].prefix }}{{ item.columns[column] }}</template>
                           <template v-else-if="columns[index].suffix">{{ item.columns[column] }}{{ columns[index].suffix }}</template>
                           <template v-else-if="columns[index].enum">{{ columns[index].enum[item.columns[column]] }}</template>
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
   </v-data-table>
</template>

<!--
<style>
@media screen and (max-width: 1279px) {
   .v-data-table__tr {
      display: block;
   }

   .v-data-table td {
      position: relative;
      display: flex;
      justify-content: flex-end;
   }

   .v-data-table td::before {
      content: attr(data-label);
      position: absolute;
      left: 12px;
      top: 0;
      font-size: 12px;
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
-->

<script generic="T" lang="ts" setup>
import TableHeader from "@/components/Table/TableHeader.vue";
import type { TDataTable, THeader } from "@/utils/types";
import { SelectableItem } from "vuetify/lib/components/VDataTable/composables/select.mjs";
import { DataTableItem, InternalDataTableHeader } from "vuetify/lib/components/VDataTable/types.mjs";
type BodySlotScope<T> = {
   internalItems: readonly DataTableItem<T>[];
   isSelected: (item: SelectableItem) => boolean;
   toggleSelect: (item: SelectableItem, index?: number, event?: MouseEvent) => void;
   columns: InternalDataTableHeader[] &
      {
         date?: string;
         prefix?: string;
         suffix?: string;
         format?: (value: any) => string;
         merge?: string[];
         enum?: any;
      }[];
};
type TProps<T> = {
   items?: T[];
   headers?: THeader<any>[];
   filter?: string;
   filterDeep?: boolean;
   filterKey?: string[];
   ripple?: boolean;
   stickyHeader?: boolean;
   stickyFooter?: boolean;
   accentHeader?: boolean;
   accentOnExpand?: boolean;
   skeleton?: string;
   loading?: boolean;
   disableSort?: boolean;
   multiExpand?: boolean;
   expandOnClick?: boolean;
   noDataText?: string;
   sortBy?: any;
};

// hooks
const date = useDate();
const { t } = useI18n();

// states
const props = withDefaults(defineProps<TDataTable & TProps<T>>(), {
   filter: "",
   filterDeep: false,
   ripple: false,
   stickyHeader: true,
   stickyFooter: true,
   accentHeader: false,
   accentOnExpand: true,
   skeleton: "table-row-divider, list-item-three-line, list-item-two-line, list-item-two-line"
});
const emit = defineEmits<{
   (event: "row:click", item: T, index: number): void;
   (event: "row:expand", item: T, index: number): void;
}>();
const items = computed(() => {
   const query = props.filter;
   if (!query) {
      return props.items;
   }

   return props.items?.filter((item) => {
      let data: any[];

      if (props.filterDeep) {
         data = Object.values(item).flatMap((v) => (v && typeof v === "object" ? Object.values(v) : v));
      } else {
         let headers: THeader<T>[] = [];
         if (Array.isArray(props.filterKey)) {
            headers = props.headers?.filter((h) => props.filterKey?.includes(h.key!)) as THeader<T>[];
         } else {
            headers = props.headers as THeader<T>[];
         }

         data = headers?.map((h) => {
            if (h.merge) {
               return h.merge.map((k) => k.split(".").reduce((acc, cur) => acc?.[cur], item)).join(" ");
            } else {
               return h.key?.split(".").reduce((acc, cur) => acc?.[cur], item);
            }
         });
      }

      return searchString(query, data.join(" "));
   });
});
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
