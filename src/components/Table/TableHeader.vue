<template>
   <tr>
      <template
         v-for="column in columns"
         v-bind:key="column.key">
         <th
            v-if="column.key === 'data-table-select'"
            class="v-data-table__td v-data-table-column--no-padding v-data-table-column--align-start v-data-table__th">
            <v-checkbox-btn
               v-bind:indeterminate="someSelected && !allSelected"
               v-bind:model-value="allSelected"
               class="text-base"
               @update:model-value="selectAll(!allSelected)" />
         </th>

         <th
            v-else-if="column.key === 'data-table-expand'"
            class="v-data-table__td v-data-table-column--no-padding v-data-table-column--align-start v-data-table__th"></th>

         <th
            v-else-if="column.key === 'actions'"
            v-bind:class="[`v-data-table-column--align-${column.align || 'start'}`]"
            class="v-data-table__td v-data-table__th">
            <div
               v-if="column.title"
               class="opacity-60">
               {{ column.title }}
            </div>
         </th>

         <th
            v-else
            v-bind:class="[`v-data-table-column--align-${column.align || 'start'}`, { 'v-data-table__th--sortable': !disableSort && column.sortable }]"
            class="v-data-table__td v-data-table__th">
            <div
               class="v-data-table-header__content relative"
               @click="!disableSort && column.sortable && toggleSort(column)">
               <span
                  v-bind:class="{ 'opacity-100': isSorted(column) }"
                  class="text-[13px] font-semibold opacity-60">
                  {{ column.title }}
               </span>
               <v-icon
                  v-if="!disableSort && column.sortable"
                  v-bind:class="{ 'opacity-100': isSorted(column) }"
                  v-bind:icon="getSortIcon(column)"
                  class="v-data-table-header__sort-icon absolute -right-2"
                  size="x-small" />

               <!-- <v-icon
                  v-if="column.removable"
                  color="medium-emphasis"
                  icon="$close"
                  @click="remove(column.key)" /> -->
            </div>
         </th>
      </template>
   </tr>
   <!-- <tr>
      <th v-bind:colspan="columns.length"></th>
   </tr> -->
</template>

<script setup>
defineProps({
   columns: { type: Array, required: true },
   isSorted: { type: Function, required: true },
   getSortIcon: { type: Function, required: true },
   toggleSort: { type: Function, required: true },
   someSelected: { type: Boolean, required: true },
   allSelected: { type: Boolean, required: true },
   selectAll: { type: Function, required: true },
   disableSort: { type: Boolean, required: true, default: false }
});
</script>
