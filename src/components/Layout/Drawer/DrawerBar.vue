<template>
   <v-navigation-drawer
      v-bind:class="{ '!w-60': expand }"
      class="bg-dark drawer-content:flex drawer-content:flex-col pt-1 select-none"
      color="background"
      rail
      theme="dark">
      <div class="flex-center w-14">
         <v-btn
            v-bind:active="expand"
            icon
            @click="expand = !expand">
            <ToggleIcon
               v-bind:icon="['$menu', '$close']"
               v-bind:toggle="!expand" />
         </v-btn>
      </div>

      <v-list class="flex flex-1 flex-col pt-1">
         <template
            v-for="item in appMenu"
            v-bind:key="item">
            <v-divider
               v-if="item.type === 'divider'"
               class="mb-1" />

            <v-list-item
               v-else-if="item.type !== 'subheader'"
               v-bind="item.props"
               v-bind:active="appStore.module === item.props?.value"
               @click="moduleHandler(item.props?.value)">
               <template v-slot:prepend>
                  <v-icon
                     v-bind:icon="item.props?.prependIcon"
                     size="default" />
               </template>

               <v-list-item-title v-if="item.title">
                  {{ typeof item.title === "function" ? item.title() : t(item.title as string) }}
               </v-list-item-title>
            </v-list-item>
         </template>

         <v-spacer />
         <v-list-item link>
            <template v-slot:prepend>
               <v-icon
                  icon="$task"
                  size="default" />
            </template>

            <v-list-item-title>
               {{ t("app.task", 2) }}
            </v-list-item-title>
         </v-list-item>
         <v-list-item link>
            <template v-slot:prepend>
               <div class="relative me-5 h-6 w-6">
                  <v-avatar
                     class="absolute -top-0.5 -left-0.5"
                     size="28px">
                     <v-img src="@/assets/image/man.svg" />
                  </v-avatar>
               </div>
            </template>

            <v-list-item-title>
               {{ t("app.profile") }}
            </v-list-item-title>
         </v-list-item>
         <v-list-item link>
            <template v-slot:prepend>
               <v-icon
                  icon="$question"
                  size="default" />
            </template>

            <v-list-item-title>
               {{ t("app.help") }}
            </v-list-item-title>
         </v-list-item>
         <v-list-item link>
            <template v-slot:prepend>
               <v-icon
                  icon="$settings"
                  size="default" />
            </template>

            <v-list-item-title>
               {{ t("app.setting") }}
            </v-list-item-title>
         </v-list-item>
      </v-list>
   </v-navigation-drawer>

   <v-overlay
      v-model="expand"
      class="!z-[1007]"
      no-click-animation
      @click="expand = false" />
</template>

<script lang="ts" setup>
import ToggleIcon from "@/components/Form/ToggleIcon.vue";
import appMenu from "@/utils/menu";

// hooks
const appStore = useAppStore();
const { t } = useI18n();

// states
const expand = ref(false);

// handlers
const moduleHandler = (value: string) => {
   appStore.setModule(value);
   expand.value = false;
};
</script>
