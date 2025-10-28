<template>
   <v-avatar
      v-if="props.image"
      rounded
      size="28">
      <v-img
         v-bind:src="getMedia(props.image || 'no-image.png')"
         cover>
         <template v-slot:error>
            <div class="flex-center h-full">
               <v-icon
                  icon="$photo"
                  v-bind:size="props.iconSize" />
            </div>
         </template>
      </v-img>
   </v-avatar>
   <v-avatar
      v-else
      rounded
      size="28">
      <v-icon
         icon="$photo"
         v-bind:size="props.iconSize" />
   </v-avatar>
</template>

<script lang="ts" setup>
import type { TAvatar } from "@/utils/types";

// states
const props = withDefaults(defineProps<TAvatar & { image: any; iconSize?: string }>(), {
   image: "no-image.png",
   iconSize: "default"
});
</script>
