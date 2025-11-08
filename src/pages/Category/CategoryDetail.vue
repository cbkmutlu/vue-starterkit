<template>
   <Container
      v-bind:error="isError"
      v-bind:form="formHandler"
      v-bind:loading="isLoading && isFirst">
      <PageCard v-bind:loading="isLoading || createPending || updatePending">
         <template v-slot:actions>
            <v-btn
               v-bind:disabled="isLoading || createPending || updatePending"
               v-bind:text="enabled ? t('app.update') : t('app.save')"
               type="submit"
               color="primary"
               density="default"
               variant="tonal" />
         </template>

         <template v-slot:title>{{ t("app.basicInfo") }}</template>

         <template v-slot:items>
            <LanguageTab
               v-model="language"
               v-bind:loading="isLoading" />
         </template>

         <v-card-text>
            <v-row no-gutters>
               <v-col md="4">
                  <v-list-subheader>{{ t("app.code") }}</v-list-subheader>
               </v-col>
               <v-col md="8">
                  <v-text-field
                     v-model="category.code"
                     v-bind:rules="[appRules.required()]" />
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
                     no-resize>
                     <template
                        v-if="language !== 1"
                        v-slot:append-inner>
                        <TranslateButton v-model="category.content" />
                     </template>
                  </v-textarea>
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
                     v-bind:delete="deleteImageHandler"
                     v-bind:items="[category.image_path]" />
                  <ImageUpload v-model="upload" />
               </v-col>
            </v-row>
         </v-card-text>
      </PageCard>
   </Container>
</template>

<script lang="ts" setup>
import TranslateButton from "@/components/Button/TranslateButton.vue";
import PageCard from "@/components/Card/PageCard.vue";
import Container from "@/components/Form/Container.vue";
import ImageList from "@/components/Form/ImageList.vue";
import ImageUpload from "@/components/Form/ImageUpload.vue";
import LanguageTab from "@/components/Tab/LanguageTab.vue";
import { ICategory, ICategoryStore, useCreateCategory, useGetCategoryById, useUpdateCategory } from "@/services/CategoryService";
import { useUnlinkFile, useUploadFile } from "@/services/FileService";

// hooks
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const snackbarStore = useSnackbarStore();
const confirmStore = useConfirmStore();

// states
const categoryInitial = { is_active: 1, sort_order: 0 } as ICategory;
const category = ref({ ...categoryInitial });
const categoryId = computed(() => route.params.id);
const enabled = computed(() => !!categoryId.value);
const language = ref(1);
const upload = ref([] as File[]);

// services
const { isLoading, isFirst, isError } = useGetCategoryById({
   enabled: enabled,
   params: {
      id: categoryId,
      language: language
   },
   onSuccess: (data) => {
      category.value = { ...data };
   }
});
const { mutateAsync: updateCategory, isPending: updatePending } = useUpdateCategory();
const { mutateAsync: createCategory, isPending: createPending } = useCreateCategory();
const { mutateAsync: uploadFile } = useUploadFile();
const { mutateAsync: unlinkFile } = useUnlinkFile({ invalidate: ["category", "categoryById"] });

// handlers
const deleteImageHandler = async () => {
   try {
      const confirm = await confirmStore.open({
         title: t("app.confirm"),
         content: t("app.deleteImage")
      });

      if (confirm) {
         await unlinkFile({
            id: category.value.id,
            table: "category",
            field: "image_path"
         });
         snackbarStore.success(t("app.imageDeleted"));
      }
   } catch (error) {
      snackbarStore.error(error);
   } finally {
      confirmStore.close();
   }
};

const formHandler = async () => {
   const payload: ICategoryStore = {
      code: category.value.code,
      title: category.value.title,
      content: category.value.content,
      is_active: category.value.is_active,
      sort_order: category.value.sort_order
   };

   try {
      if (upload.value.length) {
         await uploadFile({
            files: upload.value,
            path: "category"
         }).then((response) => {
            payload.image_path = response.data[0];
            upload.value = [];
         });
      }

      if (enabled.value) {
         await updateCategory({ id: category.value.id, ...payload });
         snackbarStore.success(t("app.recordUpdated"));
      } else {
         await createCategory(payload, {
            onSuccess: (data) => {
               router.push({ name: "categoryDetail", params: { id: data.data.id } });
               snackbarStore.success(t("app.recordCreated"));
            }
         });
      }
   } catch (error) {
      snackbarStore.error(error);
   }
};
</script>
