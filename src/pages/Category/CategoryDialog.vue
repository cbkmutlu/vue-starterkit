<template>
   <RecordDialog
      ref="recordDialog"
      @after-leave="reset">
      <template v-slot:append>
         <LanguageTab
            v-model="language"
            v-bind:loading="isLoading" />
      </template>

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
               v-bind:rules="[appRules.required()]">
               <template
                  v-if="language !== 1"
                  v-slot:append-inner>
                  <TranslateButton v-model="category.title" />
               </template>
            </v-text-field>
         </v-col>

         <v-col md="4">
            <v-list-subheader>{{ t("app.description") }}</v-list-subheader>
         </v-col>
         <v-col md="8">
            <v-textarea
               v-model="category.content"
               v-bind:rules="[appRules.required()]"
               class="max-grow-32"
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

         <v-col md="4">
            <v-list-subheader>{{ t("app.image") }}</v-list-subheader>
         </v-col>
         <v-col md="8">
            <ImageList
               v-bind:items="[category.image_path]"
               @delete="deleteImageHandler" />
            <ImageUpload v-model="upload" />
         </v-col>
      </v-row>
   </RecordDialog>
</template>

<script lang="ts" setup>
import TranslateButton from "@/components/Button/TranslateButton.vue";
import ImageList from "@/components/Form/ImageList.vue";
import ImageUpload from "@/components/Form/ImageUpload.vue";
import RecordDialog from "@/components/Layout/Dialog/RecordDialog.vue";
import LanguageTab from "@/components/Tab/LanguageTab.vue";
import { ICategory, ICategoryStore, useCreateCategory, useDeleteCategoryImage, useGetCategoryById, useUpdateCategory, useUploadCategoryImage } from "@/services/CategoryService";

// hooks
const { t } = useI18n();
const snackbarStore = useSnackbarStore();
const confirmStore = useConfirmStore();

// states
const categoryInitial = { is_active: 1, sort_order: 0 } as ICategory;
const category = ref({ ...categoryInitial });
const categoryId = computed(() => category.value.id);
const enabled = computed(() => !!category.value.id);
const language = ref(1);
const upload = ref([] as File[]);
const recordDialog = ref<InstanceType<typeof RecordDialog>>();

// services
const { isLoading, isFirst } = useGetCategoryById({
   enabled: enabled,
   params: {
      id: categoryId,
      language: language
   },
   onSuccess: (item) => {
      category.value = { ...item };
   }
});
const { mutateAsync: createCategory } = useCreateCategory();
const { mutateAsync: updateCategory } = useUpdateCategory();
const { mutateAsync: deleteImage } = useDeleteCategoryImage();
const { mutateAsync: uploadImage } = useUploadCategoryImage();

// handlers
const open = async (item?: ICategory, name?: string) => {
   try {
      if (item?.id) {
         category.value.id = item?.id;
      }

      if (name) {
         category.value.title = name;
      }

      const confirm = await recordDialog.value?.open({
         width: 800,
         title: enabled.value ? t("app.categoryUpdate") : t("app.categoryCreate"),
         loading: isLoading && isFirst
      });

      if (confirm) {
         const payload: ICategoryStore = {
            id: category.value.id,
            code: category.value.code,
            translate: [
               {
                  language_id: language.value,
                  title: category.value.title,
                  content: category.value.content
               }
            ],
            is_active: category.value.is_active,
            sort_order: category.value.sort_order
         };

         if (upload.value.length) {
            const { data } = await uploadImage({ files: upload.value });
            payload.image_path = data[0];
            upload.value = [];
         }

         if (enabled.value) {
            await updateCategory(payload);
            snackbarStore.success(t("app.recordUpdated"));
         } else {
            await createCategory(payload);
            snackbarStore.success(t("app.recordCreated"));
         }
      }
   } catch (error) {
      snackbarStore.error(error);
   } finally {
      recordDialog.value?.close();
   }
};

const deleteImageHandler = async () => {
   try {
      const confirm = await confirmStore.open({
         title: t("app.confirm"),
         content: t("app.deleteImage")
      });

      if (confirm) {
         await deleteImage({ category_id: category.value.id });
         snackbarStore.success(t("app.imageDeleted"));
      }
   } catch (error) {
      snackbarStore.error(error);
   } finally {
      confirmStore.close();
   }
};

const reset = () => {
   category.value = { ...categoryInitial };
};

defineExpose({ open, isLoading });
</script>
