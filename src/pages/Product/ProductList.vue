<template>
   <Container v-bind:loading="isLoading">
      <Header>
         <template v-slot:title>{{ t("app.productList") }}</template>
         <template v-slot:subtitle>Ürünleri buradan yönetebilirsiniz.</template>
         <template v-slot:append>
            <SearchInput v-model="filter" />
            <v-btn
               v-bind:disabled="isLoading"
               v-bind:text="t('app.add')"
               v-bind:to="{ name: 'productCreate' }"
               color="primary"
               density="default"
               variant="flat" />
         </template>
      </Header>

      <Content>
         <DataTable
            v-model="selected"
            v-bind:filter="filter"
            v-bind:headers="headers"
            v-bind:items="productAll"
            @row-click="(item) => $router.push({ name: 'productDetail', params: { id: item.id } })"
            @row-delete="deleteHandler">
            <template v-slot:item.category_list="{ item }">
               {{ (item.category_list && item.category_list.map((category: any) => category.title).join(", ")) || "-" }}
            </template>
            <template v-slot:item.brand.title="{ item }">
               {{ item.brand?.title || "-" }}
            </template>
            <template v-slot:item.actions="{ item }">
               <v-btn
                  density="compact"
                  icon="$browser"
                  variant="plain"
                  @click.stop="promptHandler(item)" />
            </template>
         </DataTable>
      </Content>
   </Container>
</template>

<script lang="ts" setup>
import SearchInput from "@/components/Form/SearchInput.vue";
import Container from "@/components/Page/Container.vue";
import Content from "@/components/Page/Content.vue";
import Header from "@/components/Page/Header.vue";
import DataTable from "@/components/Table/DataTable.vue";
import { IProduct, useDeleteProduct, useGetProductAll } from "@/services/ProductService";

// hooks
const { t } = useI18n();
const snackbarStore = useSnackbarStore();
const confirmStore = useConfirmStore();
const propmptStore = usePromptStore();

// states
const filter = ref();
const selected = ref([]);
const headers = computed((): THeader<IProduct>[] => [
   { title: t("app.code"), key: "code", width: 100 },
   { title: t("app.title"), key: "title" },
   { title: t("app.price"), key: "price", width: 150, format: formatNumber, suffix: "₺" },
   { title: t("app.category"), key: "category_list", width: 200 },
   { title: t("app.brand"), key: "brand.title", width: 200 },
   { key: "actions", width: 60 }
]);

// services
const { data: productAll, isLoading } = useGetProductAll();
const { mutateAsync: deleteProduct } = useDeleteProduct();

// handlers
const promptHandler = async (item: IProduct) => {
   try {
      const confirm = await propmptStore.open({
         content: t("app.edit"),
         prompt: item.title,
         onInput: (value: string) => upperCase(value),
         rules: [appRules.required()]
      });

      if (confirm) {
         snackbarStore.success(propmptStore.dialog.prompt);
      }
   } catch (error) {
      snackbarStore.error(error);
   } finally {
      propmptStore.close();
   }
};

const deleteHandler = async (item: IProduct) => {
   try {
      const confirm = await confirmStore.open({
         title: t("app.confirm"),
         content: t("app.deleteRecord")
      });

      if (confirm) {
         await deleteProduct({ product_id: item.id });
         snackbarStore.success(t("app.recordDeleted"));
      }
   } catch (error) {
      snackbarStore.error(error);
   } finally {
      confirmStore.close();
   }
};
</script>
