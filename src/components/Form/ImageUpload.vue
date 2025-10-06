<template>
   <v-row>
      <v-col>
         <v-file-upload
            v-model="model"
            v-bind:multiple="props.multiple"
            v-bind:title="t('app.selectOrDropImage')"
            clearable
            density="compact"
            show-size>
            <template v-slot:item="{ props: itemProps }">
               <v-file-upload-item
                  v-bind="itemProps"
                  nav></v-file-upload-item>
            </template>
         </v-file-upload>
      </v-col>
   </v-row>
</template>

<script lang="ts" setup>
const model = defineModel({ type: [Array, Object] });
const { t } = useI18n();

const props = defineProps({
   multiple: {
      type: Boolean,
      default: false
   }
});
</script>
