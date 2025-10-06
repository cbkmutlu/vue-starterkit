<template>
   <v-navigation-drawer
      class="select-none not-dark:text-gray-500"
      color="surface"
      width="224">
      <v-list>
         <template
            v-for="item in menu"
            v-bind:key="item">
            <ListGroup
               v-if="item.children"
               v-bind:item="item" />

            <ListItem
               v-else
               v-bind:item="item" />
         </template>
      </v-list>
   </v-navigation-drawer>
</template>

<script lang="ts" setup>
import ListGroup from "@/components/List/ListGroup.vue";
import ListItem from "@/components/List/ListItem.vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();
const menu = computed(() => appStore.menu[appStore.module]);
</script>
