<template>
   <v-list
      v-bind:slim="false"
      class="mb-4 max-w-full p-0"
      density="default"
      lines="two">
      <v-list-item
         v-for="item in props.data"
         v-bind:active="false"
         v-bind:border="true"
         v-bind:ellipsis="true"
         v-bind:key="item.id"
         v-bind:ripple="false"
         v-bind:subtitle="(item as any)[props.subtitle]"
         v-bind:title="(item as any)[props.title]"
         v-bind:to="props.to ? props.to + item.id : undefined"
         class="not-last:mb-2 last:mb-0">
         <template v-slot:prepend>
            <v-avatar
               density="default"
               rounded>
               <v-img
                  v-if="item.image_path || item.image_list?.length"
                  v-bind:src="getMedia(item.image_path || item.image_list?.sort((a, b) => a.sort_order - b.sort_order)[0]?.image_path)"
                  cover />
               <v-icon
                  v-else
                  icon="$question"
                  size="large" />
            </v-avatar>
         </template>

         <template
            v-if="props.delete"
            v-slot:append>
            <v-btn
               icon="$close"
               @click.stop.prevent="props.delete(item.id)" />
         </template>
      </v-list-item>
   </v-list>
</template>

<script lang="ts" setup>
type TProps = {
   data: {
      id: number;
      title: string;
      content?: string;
      value?: string;
      image_path?: string;
      image_list?: {
         id: number;
         image_path: string;
         sort_order: number;
      }[];
   }[];
   delete?: (id: number) => void;
   to?: string;
   title?: string;
   subtitle?: string | number;
};

const props = withDefaults(defineProps<TProps>(), {
   data: () => [],
   delete: () => {},
   to: undefined,
   title: "title",
   subtitle: "content"
});
</script>
