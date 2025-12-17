<template>
   <Container v-bind:loading="isLoading">
      <PageCard>
         <template v-slot:header>
            <SearchInput v-model="filter" />
         </template>

         <template v-slot:actions>
            <v-btn
               v-bind:disabled="isLoading"
               v-bind:text="t('app.add')"
               color="primary"
               density="default"
               variant="tonal"
               @click="brandDialog?.open()" />
         </template>

         <template v-slot:title>{{ t("app.brandList") }}</template>

         <DataTable
            v-bind:filter="filter"
            v-bind:headers="headers"
            v-bind:items="brandAll"
            @row-delete="deleteHandler"
            @row-edit="brandDialog?.open($event)">
            <template v-slot:item.is_active="{ item }">
               <v-chip v-bind:color="item.is_active ? 'success' : undefined">
                  {{ item.is_active ? t("app.active") : t("app.passive") }}
               </v-chip>
            </template>
         </DataTable>
      </PageCard>

      <BrandDialog ref="brandDialog" />
   </Container>
</template>

<script lang="ts" setup>
import PageCard from "@/components/Card/PageCard.vue";
import Container from "@/components/Form/Container.vue";
import SearchInput from "@/components/Form/SearchInput.vue";
import DataTable from "@/components/Table/DataTable.vue";
import { IBrand, useDeleteBrand, useGetBrandAll } from "@/services/BrandService";
const BrandDialog = defineAsyncComponent(() => import("@/pages/Brand/BrandDialog.vue"));

// hooks
const { t } = useI18n();
const snackbarStore = useSnackbarStore();
const confirmStore = useConfirmStore();

// states
const filter = ref();
const headers = computed((): THeader<IBrand>[] => [
   { title: t("app.title"), key: "title" },
   { title: t("app.status"), key: "is_active", width: 150 },
   { title: t("app.createDate"), key: "created_at", width: 250, date: "fullDate" },
   { title: t("app.updateDate"), key: "updated_at", width: 250, date: "fullDate" },
   { key: "actions", width: 90 }
]);
const brandDialog = ref<InstanceType<typeof BrandDialog>>();

// services
const { data: brandAll, isLoading } = useGetBrandAll();
const { mutateAsync: deleteBrand } = useDeleteBrand();

// handlers
const deleteHandler = async (item: IBrand) => {
   try {
      const confirm = await confirmStore.open({
         title: t("app.confirm"),
         content: t("app.deleteRecord")
      });

      if (confirm) {
         await deleteBrand({ brand_id: item.id });
         snackbarStore.success(t("app.recordDeleted"));
      }
   } catch (error) {
      snackbarStore.error(error);
   } finally {
      confirmStore.close();
   }
};
</script>
