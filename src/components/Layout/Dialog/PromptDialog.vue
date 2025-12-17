<template>
   <v-dialog
      v-model="promptStore.dialog.show"
      v-bind:max-width="promptStore.dialog.width"
      class="items-start"
      @after-leave="promptStore.reset()"
      @keydown.esc="promptStore.close()">
      <v-form
         v-model="promptStore.dialog.validate"
         @submit.prevent="promptStore.dialog.validate && promptStore.accept()">
         <v-card v-bind:loading="promptStore.dialog.loading">
            <v-toolbar v-bind:color="promptStore.dialog.titleColor">
               <v-toolbar-title class="text-base">
                  {{ promptStore.dialog.title || t("app.prompt") }}
               </v-toolbar-title>

               <template v-slot:append>
                  <v-btn
                     v-bind:disabled="!!promptStore.dialog.request"
                     icon="$close"
                     variant="text"
                     tabindex="-1"
                     @click="promptStore.close()" />
               </template>
            </v-toolbar>

            <v-card-text class="text-sm">
               <div
                  v-if="promptStore.dialog.content"
                  class="mb-2">
                  {{ promptStore.dialog.content }}
               </div>
               <v-text-field
                  v-model.trim="promptStore.dialog.prompt"
                  v-bind:hide-details="!promptStore.dialog.detail"
                  v-bind:label="promptStore.dialog.label"
                  v-bind:readonly="promptStore.dialog.request"
                  v-bind:rules="promptStore.dialog.rules"
                  v-maska="promptStore.dialog.mask"
                  autofocus
                  tabindex="0"
                  @input="promptStore.dialog.onInput && (promptStore.dialog.prompt = promptStore.dialog.onInput(promptStore.dialog.prompt))" />
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
               <v-btn
                  v-if="promptStore.dialog.onDelete !== null"
                  v-bind:color="promptStore.dialog.deleteColor"
                  v-bind:disabled="!!promptStore.dialog.request"
                  v-bind:loading="promptStore.dialog.delete"
                  v-bind:text="promptStore.dialog.deleteText || t('app.delete')"
                  v-bind:variant="promptStore.dialog.deleteVariant"
                  density="default"
                  @click="handleDelete" />

               <v-spacer v-if="promptStore.dialog.onDelete !== null" />

               <v-btn
                  v-bind:color="promptStore.dialog.cancelColor"
                  v-bind:disabled="!!promptStore.dialog.request || !!promptStore.dialog.delete"
                  v-bind:text="promptStore.dialog.cancelText || t('app.cancel')"
                  v-bind:variant="promptStore.dialog.cancelVariant"
                  density="default"
                  tabindex="-1"
                  @click="promptStore.close()" />

               <v-btn
                  v-bind:color="promptStore.dialog.acceptColor"
                  v-bind:disabled="!promptStore.dialog.validate || !!promptStore.dialog.delete"
                  v-bind:loading="promptStore.dialog.request"
                  v-bind:text="promptStore.dialog.acceptText || t('app.accept')"
                  v-bind:variant="promptStore.dialog.acceptVariant"
                  type="submit"
                  density="default"
                  tabindex="0" />
            </v-card-actions>
         </v-card>
      </v-form>
   </v-dialog>
</template>

<script lang="ts" setup>
// hooks
const { t } = useI18n();
const promptStore = usePromptStore();

const handleDelete = async () => {
   promptStore.dialog.delete = true;
   await promptStore.dialog.onDelete(true);
   promptStore.dialog.delete = false;
};
</script>
