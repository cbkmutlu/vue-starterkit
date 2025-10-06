<template>
   <v-list-group v-bind:value="props.item.props?.value">
      <template v-slot:activator="{ props }">
         <ListItem
            v-bind="props"
            v-bind:item="item" />
      </template>

      <template
         v-for="child in props.item.children"
         v-bind:key="child">
         <ListGroup
            v-if="child.children"
            v-bind:item="child" />

         <ListItem
            v-else
            v-bind:item="child" />
      </template>
   </v-list-group>
</template>

<script lang="ts" setup>
import ListItem from "@/components/List/ListItem.vue";
import type { TList } from "@/utils/vuetify";

const props = defineProps({
   item: {
      type: Object as () => TList,
      required: true
   }
});
</script>
