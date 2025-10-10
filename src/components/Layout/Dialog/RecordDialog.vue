<template>
   <ContentLoader v-model="model.loading" />
   <v-dialog
      v-if="!model.loading"
      v-model="model.show"
      v-bind:max-width="model?.width"
      class="items-start"
      @after-leave="reset()"
      @keydown.escape="close()">
      <v-form
         v-model="model.validate"
         @submit.prevent="model.validate && accept()">
         <v-card>
            <v-toolbar
               v-if="model?.title"
               v-bind:color="model.titleColor">
               <v-toolbar-title class="text-base">
                  {{ model?.title }}
               </v-toolbar-title>

               <template v-slot:append>
                  <v-btn
                     v-bind:disabled="!!model.request"
                     icon="$close"
                     variant="text"
                     tabindex="-1"
                     @click="close()" />
               </template>
            </v-toolbar>

            <v-card-text>
               <slot />
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
               <slot name="actions">
                  <v-btn
                     v-bind:color="model.cancelColor"
                     v-bind:disabled="!!model.request"
                     v-bind:text="model.cancelText || t('app.cancel')"
                     v-bind:variant="model.cancelVariant"
                     density="default"
                     tabindex="1"
                     @click="close()" />
                  <v-btn
                     v-bind:color="model.acceptColor"
                     v-bind:disabled="!model.validate"
                     v-bind:loading="model.request"
                     v-bind:text="model.acceptText || t('app.save')"
                     v-bind:variant="model.acceptVariant"
                     v-focus
                     type="submit"
                     density="default"
                     tabindex="1" />
               </slot>
            </v-card-actions>
         </v-card>
      </v-form>
   </v-dialog>
</template>

<script lang="ts" setup>
import ContentLoader from "@/components/Layout/Loader/ContentLoader.vue";

// hooks
const { t } = useI18n();

// states
const model = ref({ ...TDialog });
const emit = defineEmits(["after-leave"]);

// handlers
const reset = () => {
   model.value = { ...TDialog };
   emit("after-leave");
};

const accept = () => {
   model.value.request = true;
   model.value.resolve(true);
};

const close = () => {
   model.value.show = false;
   model.value.resolve(false);
};

const open = (payload?: { [K in keyof typeof TDialog]?: (typeof TDialog)[K] }) => {
   model.value = { ...model.value, ...payload, show: true };

   return new Promise<boolean>((resolve, reject) => {
      model.value.resolve = resolve;
      model.value.reject = reject;
   });
};

defineExpose({ open, accept, close });
</script>
