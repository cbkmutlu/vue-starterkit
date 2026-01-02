<template>
   <Container
      v-bind:error="isError"
      v-bind:form="formHandler"
      v-bind:loading="isLoading && isFirst">
      <Header>
         <template v-slot:title>{{ t("app.productDetail") }}</template>
         <template v-slot:subtitle>Ürün detayını buradan yönetebilirsiniz.</template>
         <template v-slot:append>
            <v-btn
               v-bind:disabled="isLoading || createPending || updatePending"
               v-bind:text="enabled ? t('app.update') : t('app.save')"
               type="submit"
               color="success"
               density="default"
               variant="flat" />
         </template>
      </Header>

      <Content v-bind:loading="isLoading || createPending || updatePending">
         <template v-slot:title>{{ product.code }} - {{ product.title }}</template>
         <template v-slot:append>
            <LanguageTab
               v-model="language"
               v-bind:loading="isLoading" />
         </template>

         <v-card-text>
            <v-row no-gutters>
               <v-col md="6">
                  <ListTitle
                     v-bind:title="t('app.code')"
                     subtitle="Geçerli bir kod girin." />
               </v-col>
               <v-col md="6">
                  <v-text-field
                     v-model="product.code"
                     v-bind:rules="[appRules.required()]" />
               </v-col>

               <v-col md="6">
                  <ListTitle
                     v-bind:title="t('app.title')"
                     subtitle="Ürün adını girin." />
               </v-col>
               <v-col md="6">
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

               <v-col md="6">
                  <ListTitle
                     v-bind:title="t('app.description')"
                     subtitle="Ürünü özelliklerini girin." />
               </v-col>
               <v-col md="6">
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

               <v-col md="6">
                  <ListTitle
                     v-bind:title="t('app.price')"
                     subtitle="Ürün fiyatı girin." />
               </v-col>
               <v-col md="6">
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

               <v-col md="6">
                  <ListTitle
                     v-bind:title="t('app.stock')"
                     subtitle="Ürün stok sayısını girin." />
               </v-col>
               <v-col md="6">
                  <NumberInput
                     v-model="product.stock"
                     v-bind:fraction="0"
                     v-bind:max="5"
                     v-bind:min="-5"
                     v-bind:step="1"
                     control-variant="default" />
               </v-col>

               <v-col md="6">
                  <ListTitle
                     v-bind:title="t('app.date')"
                     subtitle="Ürün tarihini girin." />
               </v-col>
               <v-col md="6">
                  <DatePicker v-model="product.date" />
               </v-col>

               <v-col md="6">
                  <ListTitle
                     v-bind:title="t('app.image', 2)"
                     subtitle="Ürün resimlerini yükleyin." />
               </v-col>
               <v-col md="6">
                  <ImageList
                     v-bind:items="product.image_list"
                     image="image_path"
                     @delete="deleteImageHandler" />
                  <ImageUpload
                     v-model="upload"
                     multiple />
               </v-col>
            </v-row>
         </v-card-text>
      </Content>

      <Content>
         <template v-slot:title>Bağlantılar</template>

         <v-card-text>
            <v-row no-gutters>
               <v-col md="6">
                  <ListTitle v-bind:header="t('app.category')" />
               </v-col>
               <v-col md="6">
                  <SelectInput
                     v-model="product.category_list"
                     v-model:filter-raw="categoryFilter"
                     v-bind:items="categoryAll"
                     v-bind:loading="categoryLoading"
                     multiple
                     return-object
                     @empty="categoryDialog?.open(undefined, categoryFilter)" />
               </v-col>

               <v-col md="6">
                  <ListTitle v-bind:header="t('app.brand')" />
               </v-col>
               <v-col md="6">
                  <SelectInput
                     v-model="product.brand"
                     v-model:filter-raw="brandFilter"
                     v-bind:items="brandAll"
                     v-bind:loading="brandLoading"
                     return-object
                     @empty="brandDialog?.open(undefined, brandFilter)" />
               </v-col>
            </v-row>
         </v-card-text>
      </Content>
      <CategoryDialog ref="categoryDialog" />
      <BrandDialog ref="brandDialog" />
   </Container>
</template>

<script lang="ts" setup>
import TranslateButton from "@/components/Button/TranslateButton.vue";
import DatePicker from "@/components/Form/DatePicker.vue";
import ImageList from "@/components/Form/ImageList.vue";
import ImageUpload from "@/components/Form/ImageUpload.vue";
import NumberInput from "@/components/Form/NumberInput.vue";
import SelectInput from "@/components/Form/SelectInput.vue";
import ListTitle from "@/components/List/ListTitle.vue";
import Container from "@/components/Page/Container.vue";
import Content from "@/components/Page/Content.vue";
import Header from "@/components/Page/Header.vue";
import LanguageTab from "@/components/Tab/LanguageTab.vue";
import { useGetBrandAll } from "@/services/BrandService";
import { useGetCategoryAll } from "@/services/CategoryService";
import { IProduct, IProductStore, useCreateProduct, useDeleteProductImage, useGetProductById, useUpdateProduct, useUploadProductImage } from "@/services/ProductService";
const CategoryDialog = defineAsyncComponent(() => import("@/pages/Category/CategoryDialog.vue"));
const BrandDialog = defineAsyncComponent(() => import("@/pages/Brand/BrandDialog.vue"));

// hooks
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const snackbarStore = useSnackbarStore();
const confirmStore = useConfirmStore();

// states
const productInitial = {
   is_active: 1,
   sort_order: 0,
   image_list: [] as IProduct["image_list"]
} as IProduct;
const product = ref({ ...productInitial });
const productId = computed(() => route.params.id);
const enabled = computed(() => !!route.params.id);
const language = ref(1);
const upload = ref([] as File[]);
const categoryFilter = ref();
const categoryDialog = ref<InstanceType<typeof CategoryDialog>>();
const brandFilter = ref();
const brandDialog = ref<InstanceType<typeof BrandDialog>>();

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
const { mutateAsync: deleteImage } = useDeleteProductImage();
const { mutateAsync: uploadImage } = useUploadProductImage();
const { data: categoryAll, isLoading: categoryLoading } = useGetCategoryAll();
const { data: brandAll, isLoading: brandLoading } = useGetBrandAll();

// handlers
const deleteImageHandler = async (image: IProduct["image_list"][number]) => {
   try {
      const confirm = await confirmStore.open({
         title: t("app.confirm"),
         content: t("app.deleteImage")
      });

      if (confirm) {
         await deleteImage({ image_id: image.id });
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
      is_active: product.value.is_active,
      sort_order: product.value.sort_order,
      stock: product.value.stock,
      price: product.value.price,
      date: product.value.date,
      product_category: product.value.category_list?.map((item) => item.id),
      brand_id: product.value.brand?.id || 0
   };

   try {
      if (upload.value.length) {
         const { data } = await uploadImage({ files: upload.value });
         payload.image_path = data;
         upload.value = [];
      }

      if (enabled.value) {
         await updateProduct({ id: product.value.id, ...payload });
         snackbarStore.success(t("app.recordUpdated"));
      } else {
         const { data } = await createProduct(payload);
         router.push({ name: "productDetail", params: { id: data.id } });
         snackbarStore.success(t("app.recordCreated"));
      }
   } catch (error) {
      snackbarStore.error(error);
   }
};
</script>
