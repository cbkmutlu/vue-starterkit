<template>
   <v-menu
      v-bind:close-on-content-click="false"
      offset="3, 0"
      transition="dialog-transition">
      <template v-slot:activator="{ props: slotProps }">
         <v-btn
            v-bind="slotProps"
            icon="$dots" />
      </template>

      <v-list v-bind:slim="false">
         <template v-for="item in props.headers">
            <v-list-item
               v-if="item.title && item.key"
               @click="sortByHandler(item.key)">
               <template v-slot:append>
                  <v-icon v-bind:icon="sortBy[0]?.key === item.key ? icon : undefined" />
               </template>

               <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
         </template>
      </v-list>
   </v-menu>
</template>

<script lang="ts" setup>
const sortBy = defineModel("sortBy", { type: Array<{ key: string; order: string }>, default: [] });
const props = defineProps({
   headers: {
      type: Array<any>,
      required: true
   }
});

const icon = computed(() => {
   if (sortBy.value[0]?.order === "asc") {
      return "$sortAsc";
   } else if (sortBy.value[0]?.order === "desc") {
      return "$sortDesc";
   }

   return undefined;
});

const sortByHandler = (key: string) => {
   const current = sortBy.value[0];

   if (!current || current.key !== key) {
      sortBy.value = [{ key, order: "asc" }];
   } else if (current.order === "asc") {
      sortBy.value = [{ key, order: "desc" }];
   } else if (current.order === "desc") {
      sortBy.value = [];
   }
};
</script>
