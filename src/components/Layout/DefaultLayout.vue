<template>
   <v-app class="bg-noise h-full">
      <!-- <DrawerBar /> -->
      <DrawerMenu v-model="drawer" />
      <Appbar v-model:drawer="drawer" />

      <v-main class="h-full">
         <div
            class="v-main__content h-full overflow-y-scroll scroll-smooth"
            id="scroll-target">
            <router-view v-slot="{ Component }">
               <component v-bind:is="Component" />
            </router-view>
         </div>
      </v-main>

      <ConfirmDialog />
      <PromptDialog />
   </v-app>
</template>

<script lang="ts" setup>
// import DrawerBar from "@/components/Layout/Drawer/DrawerBar.vue";
import DrawerMenu from "@/components/Layout/Drawer/DrawerMenu.vue";
import Appbar from "@/components/Layout/Header/Appbar.vue";
const ConfirmDialog = defineAsyncComponent(() => import("@/components/Layout/Dialog/ConfirmDialog.vue"));
const PromptDialog = defineAsyncComponent(() => import("@/components/Layout/Dialog/PromptDialog.vue"));
const drawer = ref(true);
</script>
