<template>
   <v-avatar
      v-if="props.image"
      v-bind:size="props.size"
      rounded>
      <v-img
         v-bind:src="getMedia(props.image || 'no-image.png')"
         cover>
         <template v-slot:error>
            <div class="flex-center size-full border-thin rounded-sm">
               <v-icon
                  v-bind:icon="props.icon"
                  v-bind:size="props.iconSize" />
            </div>
         </template>
         <template v-slot:placeholder>
            <div class="flex-center size-full border-thin rounded-sm">
               <v-progress-circular
                  v-bind:size="Math.min(Number(props.size) - 8, 32)"
                  indeterminate />
            </div>
         </template>
         <div
            v-if="props.onDelete || props.onEdit"
            class="flex-center bg-surface/64 size-full gap-1 text-white opacity-0 transition-opacity hover:opacity-100">
            <v-btn
               v-if="props.onEdit"
               density="compact"
               icon="$edit"
               variant="tonal"
               @click="props.onEdit" />
            <v-btn
               v-if="props.onDelete"
               density="compact"
               icon="$trash"
               variant="tonal"
               @click="props.onDelete" />
         </div>
      </v-img>
   </v-avatar>
   <v-avatar
      v-else
      v-bind:size="props.size"
      rounded>
      <v-icon
         v-bind:icon="props.icon"
         v-bind:size="props.iconSize" />
   </v-avatar>
</template>

<script lang="ts" setup>
import type { TAvatar } from "@/utils/types";
type TProps = {
   image?: any;
   icon?: string;
   iconSize?: string;
   size?: string;
   onDelete?: () => void;
   onEdit?: () => void;
};

// states
const props = withDefaults(defineProps<TAvatar & TProps>(), {
   icon: "$photo",
   iconSize: "default",
   size: "32"
});
</script>
