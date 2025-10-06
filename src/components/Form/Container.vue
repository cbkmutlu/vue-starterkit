<template>
   <v-container
      v-bind="{ ...$attrs }"
      class="overflow-visible">
      <ContentLoader
         v-if="props.overlay"
         v-model="props.loading" />

      <v-fade-transition hide-on-leave>
         <div v-if="props.loading && props.skeleton">
            <v-skeleton-loader v-bind:boilerplate="getMotionReduction()" />
         </div>

         <div v-else-if="props.error">Aradığınız sayfa bulunamadı</div>
         <div v-else>
            <v-form
               v-if="props.form"
               ref="formRef"
               @submit.prevent="submitHandler">
               <slot />
            </v-form>
            <slot v-else />
         </div>
      </v-fade-transition>
   </v-container>
</template>

<script lang="ts" setup>
import ContentLoader from "@/components/Layout/Loader/ContentLoader.vue";
import type { TContainer } from "@/utils/vuetify";

const formRef = ref<any>();

type TProps = {
   loading?: boolean;
   error?: boolean;
   overlay?: boolean;
   skeleton?: boolean;
   form?: (e?: Event) => void | Promise<void>;
};

const props = withDefaults(defineProps<TContainer & TProps>(), {
   loading: false,
   error: false,
   skeleton: true,
   overlay: false
});

const submitHandler = async (e?: Event) => {
   if (!props.form) return;

   if (formRef.value) {
      const { valid } = await formRef.value.validate();
      if (!valid) return;
   }
   await props.form(e);
};

defineExpose({
   form: formRef,
   validate: () => formRef.value?.validate(),
   isValid: () => formRef.value?.isValid
});
</script>
