<template>
   <RecordDialog
      ref="recordDialog"
      @after-leave="reset">
      <v-row no-gutters>
         <v-col md="4">
            <v-list-subheader>{{ t("app.code") }}</v-list-subheader>
         </v-col>
         <v-col md="8">
            <v-text-field
               v-model="category.code"
               v-bind:rules="[appRules.required()]"
               v-uppercase />
         </v-col>

         <v-col md="4">
            <v-list-subheader>{{ t("app.title") }}</v-list-subheader>
         </v-col>
         <v-col md="8">
            <v-text-field
               v-model="category.title"
               v-bind:rules="[appRules.required()]"
               v-ucwords />
         </v-col>

         <v-col md="4">
            <v-list-subheader>{{ t("app.description") }}</v-list-subheader>
         </v-col>
         <v-col md="8">
            <v-textarea
               v-model="category.content"
               class="[&_.v-field\_\_input]:min-h-[min(var(--v-input-control-height,56px),364px)]"
               auto-grow
               no-resize />
         </v-col>

         <v-col md="4">
            <v-list-subheader>{{ t("app.status") }}</v-list-subheader>
         </v-col>
         <v-col md="8">
            <v-switch
               v-model="category.is_active"
               v-bind:false-value="0"
               v-bind:ripple="false"
               v-bind:true-value="1"
               color="primary"
               density="compact">
               <template v-slot:label>
                  <div class="text-sm">{{ category.is_active ? t("app.active") : t("app.passive") }}</div>
               </template>
            </v-switch>
         </v-col>
      </v-row>
   </RecordDialog>
</template>

<script lang="ts" setup>
import RecordDialog from "@/components/Layout/Dialog/RecordDialog.vue";
import { ICategory, useCreateCategory, useGetCategoryById, useUpdateCategory } from "@/services/CategoryService";

// hooks
const { t } = useI18n();
const snackbarStore = useSnackbarStore();

// initials
const categoryInitial = {
   is_active: 1,
   sort_order: 0
} as ICategory;

// states
const recordDialog = ref<InstanceType<typeof RecordDialog>>();
const category = ref({ ...categoryInitial });
const dialogId = computed(() => category.value.id);
const enabled = computed(() => !!dialogId.value);

// services
const { isLoading } = useGetCategoryById({
   enabled: enabled,
   params: { id: dialogId },
   onSuccess: (item) => {
      category.value = { ...item };
   }
});
const createCategory = useCreateCategory();
const updateCategory = useUpdateCategory();

// handlers
const open = async (item?: ICategory) => {
   try {
      category.value.id = item?.id || 0;

      const confirm = await recordDialog.value?.open({
         width: 800,
         title: item?.id ? t("app.categoryUpdate") : t("app.categoryCreate"),
         loading: isLoading
      });

      if (confirm) {
         const payload: ICategory = {
            ...category.value
         };

         if (!item?.id) {
            await createCategory.mutateAsync(payload);
            snackbarStore.add({ text: t("app.recordCreated") });
         } else {
            await updateCategory.mutateAsync(payload);
            snackbarStore.add({ text: t("app.recordUpdated") });
         }
      }
   } catch (error) {
      snackbarStore.error(error || t("app.recordFailed"));
   } finally {
      recordDialog.value?.close();
   }
};

const reset = () => {
   category.value = { ...categoryInitial };
};

defineExpose({ open, isLoading });
</script>
