<template>
   <v-row>
      <v-col
         v-if="props.items?.[0] !== null && props.items?.[0] !== undefined"
         v-for="(item, index) in props.items"
         v-bind:key="index"
         cols="4"
         md="2"
         sm="3">
         <v-img
            v-bind:src="getMedia(typeof item === 'string' ? item : item?.image_path)"
            aspect-ratio="1"
            cover
            rounded>
            <div
               v-if="props.delete"
               class="flex-center size-full bg-surface/50 text-white opacity-0 transition-opacity hover:opacity-100">
               <v-btn
                  icon="$trash"
                  @click="props.delete && props.delete(item)" />
            </div>
         </v-img>
      </v-col>
   </v-row>
</template>

<script lang="ts" setup>
const props = defineProps({
   items: {
      type: [Array<string | { id: number; image_path: string }>, null],
      required: true,
      default: null
   },
   delete: {
      type: Function
   }
});
</script>
