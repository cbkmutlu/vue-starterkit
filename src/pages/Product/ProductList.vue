<template>
   <Container v-bind:loading="isLoading">
      <PageCard>
         <template v-slot:header>
            <SearchInput v-model:search="filter" />
         </template>

         <template v-slot:actions>
            <ActionButton
               v-bind:disabled="isLoading"
               v-bind:to="{ name: 'productCreate' }"
               color="primary">
               {{ t("app.add") }}
            </ActionButton>
         </template>

         <template v-slot:title>{{ t("app.productList") }}</template>

         <DataTable
            v-model="selected"
            v-bind:filter="filter"
            v-bind:headers="headers"
            v-bind:items="data"
            @row:click="(item) => $router.push({ name: 'productDetail', params: { id: item.id } })">

            <template v-slot:item.category_list="{ item }">
               {{ item.category_list && item.category_list.map((category: any) => category.title).join(", ") }}
            </template>

            <template v-slot:item.actions="{ item }">
               <TableButton
                  icon="$trash"
                  @click.stop="deleteHandler(item)" />
            </template>
         </DataTable>
      </PageCard>
   </Container>
</template>

<script lang="ts" setup>
import ActionButton from "@/components/Button/ActionButton.vue";
import TableButton from "@/components/Button/TableButton.vue";
import PageCard from "@/components/Card/PageCard.vue";
import Container from "@/components/Form/Container.vue";
import SearchInput from "@/components/Form/SearchInput.vue";
import DataTable from "@/components/Table/DataTable.vue";
import { IProduct, useDeleteProduct, useGetProductAll } from "@/services/ProductService";

// hooks
const { t } = useI18n();
const snackbarStore = useSnackbarStore();
const confirmStore = useConfirmStore();

// states
const filter = ref();
const selected = ref([]);
const headers = computed((): THeader<IProduct>[] => [
   { title: t("app.code"), key: "code", width: "100" },
   { title: t("app.title"), key: "title" },
   { title: t("app.price"), key: "price", width: "150", format: formatNumber, suffix: "₺" },
   { title: t("app.category"), key: "category_list", width: "350" },
   { key: "actions", width: "60" }
]);

// services
const { data, isLoading } = useGetProductAll();
const deleteProduct = useDeleteProduct();

// handlers
const deleteHandler = async (item: IProduct) => {
   try {
      const confirm = await confirmStore.open({
         title: t("app.confirm"),
         content: t("app.deleteRecord")
      });

      if (confirm) {
         await deleteProduct.mutateAsync({ id: item.id });
         snackbarStore.success(t("app.recordDeleted"));
      }
   } catch (error) {
      snackbarStore.error(error);
   } finally {
      confirmStore.close();
   }
};
</script>
