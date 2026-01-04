<template>
   <Bar>
      <v-tabs
         color="primary"
         fixed-tabs>
         <v-tab v-bind:to="{ name: 'user-profile' }">Kullanıcı Bilgileri</v-tab>
         <v-tab v-bind:to="{ name: 'user-password' }">Şifre Değiştir</v-tab>
      </v-tabs>
   </Bar>

   <router-view />
</template>

<script lang="ts" setup>
import Bar from "@/components/Page/Bar.vue";
</script>
