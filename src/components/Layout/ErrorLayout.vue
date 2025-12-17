<template>
   <v-sheet
      class="bg-noise flex-center h-full flex-col"
      tile>
      <router-view v-bind:key="$route.fullPath" />
   </v-sheet>
</template>
