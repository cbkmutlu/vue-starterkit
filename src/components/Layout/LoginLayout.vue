<template>
   <v-sheet
      class="flex h-full items-center justify-center bg-white bg-[url('/src/assets/image/login-bg2.jpg')] bg-cover bg-right bg-no-repeat"
      tile>
      <v-row>
         <v-col
            lg="4"
            md="5"
            offset-sm="1"
            sm="6"
            xl="3">
            <router-view />
         </v-col>
      </v-row>
   </v-sheet>
</template>
