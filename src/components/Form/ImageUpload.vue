<template>
   <v-row>
      <v-col>
         <v-file-upload
            v-model="model"
            v-bind:multiple="props.multiple"
            class="p-4"
            clearable
            density="comfortable"
            show-size>
            <template v-slot:item="{ props: slotProps }">
               <v-file-upload-item
                  v-bind="slotProps"
                  nav></v-file-upload-item>
            </template>

            <template v-slot:title>
               <div class="text-base font-normal">{{ t("app.selectOrDropImage") }}</div>
            </template>

            <template v-slot:icon>
               <v-icon size="xlarge">$upload</v-icon>
            </template>
         </v-file-upload>
      </v-col>
   </v-row>
</template>

<script lang="ts" setup>
// hooks
const { t } = useI18n();

// states
const model = defineModel({ type: [Array, Object] });
const props = defineProps({
   multiple: {
      type: Boolean,
      default: false
   }
});
</script>
