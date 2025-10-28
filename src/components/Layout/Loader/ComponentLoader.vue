<template>
   <v-fade-transition leave-absolute>
      <v-progress-linear
         v-if="appStore.componentLoading"
         class="absolute top-0 z-1005"
         color="primary"
         height="3"
         indeterminate />
   </v-fade-transition>
</template>

<script lang="ts" setup>
/**
 * en üstte yer alan linear loader
 * componentler arasında geçişte animasyon için kullanılır.
 */
const appStore = useAppStore();
</script>
