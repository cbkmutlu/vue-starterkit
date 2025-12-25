<template>
   <v-list-subheader v-if="props.header">
      {{ props.header }}
   </v-list-subheader>

   <v-list-item
      v-else
      class="p-0"
      density="comfortable"
      nav>
      <template
         v-if="props.prependIcon"
         v-slot:prepend>
         <v-icon
            v-bind:icon="props.prependIcon"
            class="list-spacer-3" />
      </template>

      <template
         v-if="props.appendIcon"
         v-slot:append>
         <v-icon
            v-bind:icon="props.appendIcon"
            class="list-spacer-3" />
      </template>

      <v-list-item-title
         v-if="props.title"
         class="opacity-90">
         {{ props.title }}
      </v-list-item-title>

      <v-list-item-subtitle
         v-if="props.subtitle"
         class="opacity-60">
         {{ props.subtitle }}
      </v-list-item-subtitle>
   </v-list-item>
</template>

<script lang="ts" setup>
const props = defineProps<{
   title?: string;
   subtitle?: string;
   header?: string;
   prependIcon?: string;
   appendIcon?: string;
}>();
</script>
