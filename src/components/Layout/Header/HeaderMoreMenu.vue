<template>
   <v-menu offset="3, 0" transition="dialog-transition">
      <template v-slot:activator="{ props }">
         <v-btn
            v-bind="props"
            icon="$dots" />
      </template>

      <v-list v-bind:slim="false">
         <v-list-item
            append-icon="$user"
            link>
            <v-list-item-title>{{ t("app.profile") }}</v-list-item-title>
         </v-list-item>

         <v-list-item
            append-icon="$logout"
            link
            @click="logoutHandler">
            <v-list-item-title>{{ t("app.logout") }}</v-list-item-title>
         </v-list-item>
      </v-list>
   </v-menu>
</template>

<script lang="ts" setup>
// hooks
const { t } = useI18n();
const authStore = useAuthStore();

// states
const logoutHandler = () => {
   authStore.userLogout();
};
</script>
