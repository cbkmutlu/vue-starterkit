<template>
   <Container v-bind:loading="isLoading">
      <Header>
         <template v-slot:prepend>
            {{ t("app.categoryList") }}
         </template>
         <template v-slot:append>
            <SearchInput v-model="filter" />
            <v-btn
               v-bind:disabled="isLoading"
               v-bind:text="t('app.add')"
               color="primary"
               density="default"
               variant="tonal"
               @click="categoryDialog?.open()" />
         </template>
      </Header>

      <Content>
         <DataTable
            v-bind:filter="filter"
            v-bind:headers="headers"
            v-bind:items="categoryAll"
            @row-delete="deleteHandler"
            @row-edit="categoryDialog?.open($event)">
            <template v-slot:item.is_active="{ item }">
               <v-chip v-bind:color="item.is_active ? 'success' : undefined">
                  {{ item.is_active ? t("app.active") : t("app.passive") }}
               </v-chip>
            </template>
         </DataTable>
      </Content>

      <CategoryDialog ref="categoryDialog" />
   </Container>
</template>

<script lang="ts" setup>
import SearchInput from "@/components/Form/SearchInput.vue";
import Container from "@/components/Page/Container.vue";
import Content from "@/components/Page/Content.vue";
import Header from "@/components/Page/Header.vue";
import DataTable from "@/components/Table/DataTable.vue";
import { ICategory, useDeleteCategory, useGetCategoryAll } from "@/services/CategoryService";
const CategoryDialog = defineAsyncComponent(() => import("@/pages/Category/CategoryDialog.vue"));

// hooks
const { t } = useI18n();
const snackbarStore = useSnackbarStore();
const confirmStore = useConfirmStore();

// states
const filter = ref();
const headers = computed((): THeader<ICategory>[] => [
   { title: t("app.code"), key: "code", width: 100 },
   { title: t("app.title"), key: "title" },
   { title: t("app.status"), key: "is_active", width: 150 },
   { title: t("app.createDate"), key: "created_at", width: 250, date: "fullDate" },
   { title: t("app.updateDate"), key: "updated_at", width: 250, date: "fullDate" },
   { key: "actions", width: 90 }
]);
const categoryDialog = ref<InstanceType<typeof CategoryDialog>>();

// services
const { data: categoryAll, isLoading } = useGetCategoryAll();
const { mutateAsync: deleteCategory } = useDeleteCategory();

// handlers
const deleteHandler = async (item: ICategory) => {
   try {
      const confirm = await confirmStore.open({
         title: t("app.confirm"),
         content: t("app.deleteRecord")
      });

      if (confirm) {
         await deleteCategory({ category_id: item.id });
         snackbarStore.success(t("app.recordDeleted"));
      }
   } catch (error) {
      snackbarStore.error(error);
   } finally {
      confirmStore.close();
   }
};
</script>
