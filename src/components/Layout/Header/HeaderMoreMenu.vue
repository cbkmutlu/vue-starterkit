<template>
   <v-menu
      offset="3, 0"
      transition="dialog-transition">
      <template v-slot:activator="{ props: slotProps }">
         <v-btn
            v-bind="slotProps"
            v-bind:loading="isPending"
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
import { useLogoutUser } from '@/services/UserService';

// hooks
const { t } = useI18n();
const authStore = useAuthStore();

// services
const { mutateAsync: logoutUser, isPending } = useLogoutUser();

// handlers
const logoutHandler = async () => {
   await logoutUser({
      token: authStore.refreshToken
   });
   authStore.userLogout();
};
</script>
