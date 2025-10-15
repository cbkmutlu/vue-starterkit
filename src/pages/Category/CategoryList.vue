<template>
   <Container v-bind:loading="isLoading">
      <PageCard>
         <template v-slot:header>
            <SearchInput v-model="filter" />
         </template>

         <template v-slot:actions>
            <ActionButton
               v-bind:disabled="isLoading"
               color="primary"
               @click="recordHandler()">
               {{ t("app.add") }}
            </ActionButton>
         </template>

         <template v-slot:title>{{ t("app.categoryList") }}</template>

         <DataTable
            v-bind:filter="filter"
            v-bind:headers="headers"
            v-bind:items="data"
            @row:click="(item) => $router.push({ name: 'categoryDetail', params: { id: item.id } })">
            <template v-slot:item.is_active="{ item }">
               <v-chip v-bind:color="item.is_active ? 'success' : undefined">
                  {{ item.is_active ? t("app.active") : t("app.passive") }}
               </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
               <TableButton
                  icon="$trash"
                  @click.stop="deleteHandler(item)" />
               <TableButton
                  icon="$edit"
                  @click.stop="recordHandler(item)" />
               <TableButton
                  icon="$browser"
                  @click.stop="promptHandler(item)" />
            </template>
         </DataTable>
      </PageCard>

      <CategoryDialog ref="categoryDialog" />
   </Container>
</template>

<script lang="ts" setup>
import ActionButton from "@/components/Button/ActionButton.vue";
import TableButton from "@/components/Button/TableButton.vue";
import PageCard from "@/components/Card/PageCard.vue";
import Container from "@/components/Form/Container.vue";
import SearchInput from "@/components/Form/SearchInput.vue";
import DataTable from "@/components/Table/DataTable.vue";
import { ICategory, useDeleteCategory, useGetCategoryAll } from "@/services/CategoryService";
const CategoryDialog = defineAsyncComponent(() => import("@/pages/Category/CategoryDialog.vue"));

// hooks
const { t } = useI18n();
const snackbarStore = useSnackbarStore();
const confirmStore = useConfirmStore();
const propmptStore = usePromptStore();

// states
const filter = ref();
const headers = computed((): THeader<ICategory>[] => [
   { title: t("app.code"), key: "code", width: "100" },
   { title: t("app.title"), key: "title" },
   { title: t("app.status"), key: "is_active", width: "150" },
   { title: t("app.createDate"), key: "created_at", width: "250", date: "fullDate" },
   { title: t("app.updateDate"), key: "updated_at", width: "250", date: "fullDate" },
   { key: "actions", width: "90" }
]);
const categoryDialog = ref<InstanceType<typeof CategoryDialog>>();

// services
const { data, isLoading } = useGetCategoryAll();
const deleteProduct = useDeleteCategory();

// handlers
const recordHandler = (item?: ICategory) => {
   categoryDialog.value?.open(item);
};

const deleteHandler = async (item: ICategory) => {
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

const promptHandler = async (item: ICategory) => {
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
</script>
