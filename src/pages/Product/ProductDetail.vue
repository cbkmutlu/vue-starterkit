<template>
   <Container
      v-bind:error="isError"
      v-bind:form="formHandler"
      v-bind:loading="isLoading && isFirst">
      <PageCard v-bind:loading="isLoading || createPending || updatePending">
         <template v-slot:actions>
            <ActionButton
               v-bind:disabled="isLoading || createPending || updatePending"
               v-bind:text="enabled ? t('app.update') : t('app.save')"
               type="submit"
               prepend-icon="$save" />
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
                     class="max-grow-32"
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
                  <NumberInput
                     v-model="product.price"
                     control-variant="split"
                     prepend-inner-icon="$tag">
                     <template v-slot:append>
                        <v-btn
                           v-bind:ripple="false"
                           class="h-full"
                           density="compact"
                           variant="tonal"
                           @click="product.price = 500">
                           500
                        </v-btn>
                     </template>
                  </NumberInput>
               </v-col>

               <v-col md="4">
                  <v-list-subheader>{{ t("app.image", 2) }}</v-list-subheader>
               </v-col>
               <v-col md="8">
                  <ImageList
                     v-bind:delete="deleteImageHandler"
                     v-bind:items="product.image_list" />
                  <ImageUpload
                     v-model="upload"
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
import { useUnlinkFile, useUploadFile } from "@/services/FileService";
import { IProduct, IProductStore, useCreateProduct, useGetProductById, useUpdateProduct } from "@/services/ProductService";

// hooks
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const snackbarStore = useSnackbarStore();
const confirmStore = useConfirmStore();

// states
const productInitial = { is_active: 1, sort_order: 0 } as IProduct;
const product = ref({ ...productInitial });
const productId = computed(() => route.params.id);
const enabled = computed(() => !!productId.value);
const language = ref(1);
const upload = ref([] as File[]);

// services
const { isLoading, isFirst, isError } = useGetProductById({
   enabled: enabled,
   params: {
      id: productId,
      language: language
   },
   onSuccess: (item) => {
      product.value = { ...item };
   }
});
const { mutateAsync: updateProduct, isPending: updatePending } = useUpdateProduct();
const { mutateAsync: createProduct, isPending: createPending } = useCreateProduct();
const { mutateAsync: uploadFile } = useUploadFile();
const { mutateAsync: unlinkFile } = useUnlinkFile({ invalidate: ["product", "productById"] });
const { data: categoryAll, isLoading: categoryLoading } = useGetCategoryAll();

// handlers
const deleteImageHandler = async (image: any) => {
   try {
      const confirm = await confirmStore.open({
         title: t("app.confirm"),
         content: t("app.deleteImage")
      });

      if (confirm) {
         await unlinkFile({
            id: image.id,
            table: "product_image",
            field: "image_path",
            delete: true
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
   const payload: IProductStore = {
      code: product.value.code,
      title: product.value.title,
      content: product.value.content,
      price: product.value.price,
      is_active: product.value.is_active,
      sort_order: product.value.sort_order,
      product_category: product.value.category_list?.map((item) => item.id)
   };

   try {
      if (upload.value.length) {
         await uploadFile({
            files: upload.value,
            path: "product"
         }).then((response) => {
            payload.image_path = response.data;
            upload.value = [];
         });
      }

      if (enabled.value) {
         await updateProduct({ id: product.value.id, ...payload });
         snackbarStore.success(t("app.recordUpdated"));
      } else {
         await createProduct(payload, {
            onSuccess: (data) => {
               router.push({ name: "productDetail", params: { id: data.data.id } });
               snackbarStore.success(t("app.recordCreated"));
            }
         });
      }

      console.info(payload);
   } catch (error) {
      snackbarStore.error(error);
   }
};
</script>
