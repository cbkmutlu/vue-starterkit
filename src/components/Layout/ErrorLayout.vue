<template>
   <v-container class="h-full">
      <router-view v-bind:key="$route.fullPath" />
   </v-container>
</template>
