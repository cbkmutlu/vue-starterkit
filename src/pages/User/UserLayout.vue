<template>
   <Bar>
      <v-tabs
         color="primary"
         fixed-tabs>
         <v-tab v-bind:to="{ path: '/user-profile' }">Kullanıcı Bilgileri</v-tab>
         <v-tab v-bind:to="{ path: '/user-password' }">Şifre Değiştir</v-tab>
      </v-tabs>
   </Bar>

   <router-view />
</template>

<script lang="ts" setup>
import Bar from "@/components/Page/Bar.vue";
</script>
