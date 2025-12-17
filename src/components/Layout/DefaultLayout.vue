<template>
   <v-app class="bg-noise h-full">
      <!-- <DrawerBar /> -->
      <DrawerMenu />
      <Header />

      <v-main class="h-full">
         <div class="v-main__content h-full overflow-y-scroll scroll-smooth">
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
import Header from "@/components/Layout/Header/Header.vue";
const ConfirmDialog = defineAsyncComponent(() => import("@/components/Layout/Dialog/ConfirmDialog.vue"));
const PromptDialog = defineAsyncComponent(() => import("@/components/Layout/Dialog/PromptDialog.vue"));
</script>
