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
                  size="default" />
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
         size="default" />
   </v-avatar>
</template>

<script lang="ts" setup>
import type { TAvatar } from "@/utils/types";

// states
const props = withDefaults(defineProps<TAvatar & { image: any }>(), {
   image: "no-image.png"
});
</script>
