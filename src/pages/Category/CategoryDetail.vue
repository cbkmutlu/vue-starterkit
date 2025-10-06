<template>
   <Container
      v-bind:error="isError"
      v-bind:form="formHandler"
      v-bind:loading="isLoading && isFirst">
      <PageCard v-bind:loading="isLoading || isPending">
         <template v-slot:actions>
            <ActionButton
               v-bind:disabled="isLoading || isPending"
               type="submit"
               prepend-icon="$save">
               {{ isDetail ? t("app.update") : t("app.save") }}
            </ActionButton>
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
                     class="max-grow-364"
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
                     v-bind:items="[category.image]" />
                  <ImageUpload v-model="imageUpload" />
               </v-col>
            </v-row>
         </v-card-text>
      </PageCard>
   </Container>
</template>

<script lang="ts" setup>
import ActionButton from "@/components/Button/ActionButton.vue";
import TranslateButton from "@/components/Button/TranslateButton.vue";
import PageCard from "@/components/Card/PageCard.vue";
import Container from "@/components/Form/Container.vue";
import ImageList from "@/components/Form/ImageList.vue";
import ImageUpload from "@/components/Form/ImageUpload.vue";
import LanguageTab from "@/components/Tab/LanguageTab.vue";
import { ICategory, ICategoryStore, useCreateCategory, useGetCategoryById, useUpdateCategory } from "@/services/CategoryService";
import { useDeleteImage, useUploadImage } from "@/services/ImageService";

// hooks
const { t } = useI18n();
const route = useRoute() as TRoute;
const router = useRouter();
const snackbarStore = useSnackbarStore();
const confirmStore = useConfirmStore();

// states
const category = ref({
   is_active: 1,
   sort_order: 0
} as ICategory);
const routeId = computed(() => route.params.id);
const isDetail = computed(() => !!routeId.value);
const language = ref(1);
const imageUpload = ref([] as File[]);

// services
const getCategoryById = useGetCategoryById({
   enabled: isDetail,
   params: {
      id: routeId,
      language: language
   },
   onSuccess: (data) => {
      category.value = { ...data };
   }
});
const updateCategory = useUpdateCategory();
const createCategory = useCreateCategory();
const uploadImage = useUploadImage();
const deleteImage = useDeleteImage({ invalidate: ["category", "categoryById"] });

// status
const isLoading = computed(() => getCategoryById.isLoading.value);
const isFirst = computed(() => getCategoryById.isFirst.value);
const isPending = computed(() => createCategory.isPending.value || updateCategory.isPending.value);
const isError = computed(() => getCategoryById.isError.value);

// mutates
const deleteImageMutate = async () => {
   return await deleteImage.mutateAsync({
      id: category.value.id,
      table: "category"
   });
};

const uploadImageMutate = async () => {
   return await uploadImage.mutateAsync({
      files: imageUpload.value,
      path: "category"
   });
};

// handlers
const deleteImageHandler = async () => {
   try {
      const confirm = await confirmStore.open({
         title: t("app.confirm"),
         message: t("app.deleteImage")
      });

      if (confirm) {
         await deleteImageMutate();
         snackbarStore.add({ text: t("app.imageDeleted") });
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
      if (imageUpload.value.length) {
         if (category.value.image) {
            await deleteImageMutate();
            snackbarStore.add({ text: t("app.imageDeleted") });
         }

         const upload = await uploadImageMutate();
         payload.image_upload = upload.data[0];
         imageUpload.value = [];
      }

      if (isDetail.value) {
         await updateCategory.mutateAsync({ id: category.value.id, ...payload });
         snackbarStore.add({ text: t("app.recordUpdated") });
      } else {
         await createCategory.mutateAsync(payload, {
            onSuccess: (data) => {
               router.push({ name: "categoryDetail", params: { id: data.data.id } });
               snackbarStore.add({ text: t("app.recordCreated") });
            }
         });
      }
   } catch (error) {
      snackbarStore.error(error);
   }
};
</script>
