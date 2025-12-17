<template>
   <RecordDialog
      ref="recordDialog"
      @after-leave="reset">
      <v-row no-gutters>
         <v-col md="4">
            <v-list-subheader>{{ t("app.title") }}</v-list-subheader>
         </v-col>
         <v-col md="8">
            <v-text-field
               v-model="brand.title"
               v-bind:rules="[appRules.required()]"
               v-ucwords />
         </v-col>

         <v-col md="4">
            <v-list-subheader>{{ t("app.description") }}</v-list-subheader>
         </v-col>
         <v-col md="8">
            <v-textarea
               v-model="brand.content"
               class="max-grow-32"
               auto-grow
               no-resize />
         </v-col>

         <v-col md="4">
            <v-list-subheader>{{ t("app.status") }}</v-list-subheader>
         </v-col>
         <v-col md="8">
            <v-switch
               v-model="brand.is_active"
               v-bind:false-value="0"
               v-bind:ripple="false"
               v-bind:true-value="1"
               color="primary"
               density="compact">
               <template v-slot:label>
                  <div class="text-sm">{{ brand.is_active ? t("app.active") : t("app.passive") }}</div>
               </template>
            </v-switch>
         </v-col>
      </v-row>
   </RecordDialog>
</template>

<script lang="ts" setup>
import RecordDialog from "@/components/Layout/Dialog/RecordDialog.vue";
import { IBrand, useCreateBrand, useGetBrandById, useUpdateBrand } from "@/services/BrandService";

// hooks
const { t } = useI18n();
const snackbarStore = useSnackbarStore();

// states
const brandInitial = { is_active: 1, sort_order: 0 } as IBrand;
const brand = ref({ ...brandInitial });
const brandId = computed(() => brand.value.id);
const enabled = computed(() => !!brand.value.id);
const recordDialog = ref<InstanceType<typeof RecordDialog>>();

// services
const { isLoading } = useGetBrandById({
   enabled: enabled,
   params: {
      id: brandId
   },
   onSuccess: (item) => {
      brand.value = { ...item };
   }
});
const { mutateAsync: createBrand } = useCreateBrand();
const { mutateAsync: updateBrand } = useUpdateBrand();

// handlers
const open = async (item?: IBrand, name?: string) => {
   try {
      if (item?.id) {
         brand.value.id = item?.id;
      }

      if (name) {
         brand.value.title = name;
      }

      const confirm = await recordDialog.value?.open({
         width: 800,
         title: enabled.value ? t("app.brandUpdate") : t("app.brandCreate"),
         loading: isLoading
      });

      if (confirm) {
         const payload: IBrand = {
            ...brand.value
         };

         if (enabled.value) {
            await updateBrand(payload);
            snackbarStore.success(t("app.recordUpdated"));
         } else {
            await createBrand(payload);
            snackbarStore.success(t("app.recordCreated"));
         }
      }
   } catch (error) {
      snackbarStore.error(error);
   } finally {
      recordDialog.value?.close();
   }
};

const reset = () => {
   brand.value = { ...brandInitial };
};

defineExpose({ open, isLoading });
</script>
