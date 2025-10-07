<template>
   <div
      class="h-full"
      id="wrapper">
      <v-app v-bind:class="theme.current.value.dark ? 'bg-dark' : 'bg-light'" class="h-full">
         <DrawerBar />
         <DrawerMenu />
         <Header />

         <v-main class="h-full overflow-y-scroll scroll-smooth">
            <ComponentLoader />

            <!-- <div
               class="v-main__scroller h-full overflow-y-scroll scroll-smooth"
               id="main"> -->
               <router-view v-slot="{ Component }">
                  <v-fade-transition leave-absolute>
                     <component v-bind:is="Component" />
                  </v-fade-transition>
               </router-view>
            <!-- </div> -->
         </v-main>

         <ConfirmDialog />
         <PromptDialog />
      </v-app>

      <v-snackbar-queue
         v-model="snackbarStore.queue"
         closable />
   </div>
</template>

<script lang="ts" setup>
import DrawerBar from "@/components/Layout/Drawer/DrawerBar.vue";
import DrawerMenu from "@/components/Layout/Drawer/DrawerMenu.vue";
import Header from "@/components/Layout/Header/Header.vue";
import ComponentLoader from "@/components/Layout/Loader/ComponentLoader.vue";
const ConfirmDialog = defineAsyncComponent(() => import("@/components/Layout/Dialog/ConfirmDialog.vue"));
const PromptDialog = defineAsyncComponent(() => import("@/components/Layout/Dialog/PromptDialog.vue"));

// hooks
const snackbarStore = useSnackbarStore();
const theme = useTheme();
</script>
