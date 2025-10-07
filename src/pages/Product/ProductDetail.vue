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
                     v-model="product.code"
                     v-bind:rules="[appRules.required()]" />
               </v-col>

               <v-col md="4">
                  <v-list-subheader>{{ t("app.title") }}</v-list-subheader>
               </v-col>
               <v-col md="8">
                  <v-text-field
                     v-model="product.title"
                     v-bind:rules="[appRules.required()]">
                     <template
                        v-if="language !== 1"
                        v-slot:append-inner>
                        <TranslateButton v-model="product.title" />
                     </template>
                  </v-text-field>
               </v-col>

               <v-col md="4">
                  <v-list-subheader>{{ t("app.date") }}</v-list-subheader>
               </v-col>
               <v-col md="8">
                  <DatePicker />
               </v-col>

               <v-col md="4">
                  <v-list-subheader>{{ t("app.description") }}</v-list-subheader>
               </v-col>
               <v-col md="8">
                  <v-textarea
                     v-model="product.content"
                     v-bind:rules="[appRules.required()]"
                     class="max-grow-364"
                     auto-grow
                     no-resize>
                     <template
                        v-if="language !== 1"
                        v-slot:append-inner>
                        <TranslateButton v-model="product.content" />
                     </template>
                  </v-textarea>
               </v-col>

               <v-col md="4">
                  <v-list-subheader>{{ t("app.price") }}</v-list-subheader>
               </v-col>
               <v-col md="8">
                  <NumberInput v-model="product.price" />
               </v-col>

               <v-col md="4">
                  <v-list-subheader>{{ t("app.image", 2) }}</v-list-subheader>
               </v-col>
               <v-col md="8">
                  <ImageList
                     v-bind:delete="deleteImageHandler"
                     v-bind:items="product.image_list" />
                  <ImageUpload
                     v-model="imageUpload"
                     multiple />
               </v-col>
            </v-row>
         </v-card-text>
      </PageCard>

      <PageCard>
         <template v-slot:title>Bağlantılar</template>

         <v-card-text>
            <v-row no-gutters>
               <v-col md="4">
                  <v-list-subheader>{{ t("app.category") }}</v-list-subheader>
               </v-col>
               <v-col md="8">
                  <SelectInput
                     v-model="product.category_list"
                     v-bind:items="categoryAll"
                     v-bind:loading="categoryLoading"
                     item-value="id"
                     multiple
                     return-object />
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
import DatePicker from "@/components/Form/DatePicker.vue";
import ImageList from "@/components/Form/ImageList.vue";
import ImageUpload from "@/components/Form/ImageUpload.vue";
import NumberInput from "@/components/Form/NumberInput.vue";
import SelectInput from "@/components/Form/SelectInput.vue";
import LanguageTab from "@/components/Tab/LanguageTab.vue";
import { useGetCategoryAll } from "@/services/CategoryService";
import { useDeleteImage, useUploadImage } from "@/services/ImageService";
import { IProduct, IProductStore, useCreateProduct, useGetProductById, useUpdateProduct } from "@/services/ProductService";

// hooks
const { t } = useI18n();
const route = useRoute() as TRoute;
const router = useRouter();
const snackbarStore = useSnackbarStore();
const confirmStore = useConfirmStore();

// states
const product = ref({
   is_active: 1,
   sort_order: 0,
   category_list: [] as any
} as IProduct);
const routeId = computed(() => route.params.id);
const isDetail = computed(() => !!routeId.value);
const language = ref(1);
const imageUpload = ref([] as File[]);

// services
const getProductById = useGetProductById({
   enabled: isDetail,
   params: {
      id: routeId,
      language: language
   },
   onSuccess: (item) => {
      product.value = { ...item };
   }
});
const updateProduct = useUpdateProduct();
const createProduct = useCreateProduct();
const uploadImage = useUploadImage();
const deleteImage = useDeleteImage({ invalidate: ["product", "productById"] });

// relation services
const { data: categoryAll, isLoading: categoryLoading } = useGetCategoryAll();

// status
const isLoading = computed(() => getProductById.isLoading.value);
const isFirst = computed(() => getProductById.isFirst.value);
const isPending = computed(() => createProduct.isPending.value || updateProduct.isPending.value);
const isError = computed(() => getProductById.isError.value);

// mutates
const deleteImageMutate = async (item: IListImage) => {
   return await deleteImage.mutateAsync({
      id: item.id,
      table: "product_image",
      delete: true
   });
};

const uploadImageMutate = async () => {
   return await uploadImage.mutateAsync({
      files: imageUpload.value,
      path: "product/" + product.value.id
   });
};

// handlers
const deleteImageHandler = async (image: any) => {
   try {
      const confirm = await confirmStore.open({
         title: t("app.confirm"),
         message: t("app.deleteImage")
      });

      if (confirm) {
         await deleteImageMutate(image);
         snackbarStore.add({ text: t("app.imageDeleted") });
      }
   } catch (error) {
      snackbarStore.error(error);
   } finally {
      confirmStore.close();
   }
};

const formHandler = async () => {
   const payload: IProductStore = {
      code: product.value.code,
      title: product.value.title,
      content: product.value.content,
      price: product.value.price,
      is_active: product.value.is_active,
      sort_order: product.value.sort_order,
      product_category: product.value.category_list.map((item) => item.id)
   };

   try {
      if (imageUpload.value.length) {
         const upload = await uploadImageMutate();
         payload.image_path = upload.data;
         imageUpload.value = [];
      }

      if (isDetail.value) {
         await updateProduct.mutateAsync({ id: product.value.id, ...payload });
         snackbarStore.add({ text: t("app.recordUpdated") });
      } else {
         await createProduct.mutateAsync(payload, {
            onSuccess: (data) => {
               router.push({ name: "productDetail", params: { id: data.data.id } });
               snackbarStore.add({ text: t("app.recordCreated") });
            }
         });
      }
   } catch (error) {
      snackbarStore.error(error);
   }
};
</script>
