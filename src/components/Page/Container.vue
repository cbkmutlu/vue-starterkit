<template>
   <v-container max-width="1200">
      <ContentLoader
         v-if="props.overlay"
         v-model="props.loading" />

      <v-fade-transition hide-on-leave>
         <div
            v-if="props.loading && props.skeleton"
            class="container__content">
            <v-skeleton-loader v-bind:boilerplate="getMotionReduction()" />
         </div>

         <div
            v-else-if="props.error"
            class="container__content">
            Aradığınız sayfa bulunamadı
         </div>
         <div
            v-else
            class="container__content">
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
import type { TContainer } from "@/utils/types";
type TProps = {
   loading?: boolean;
   error?: boolean;
   overlay?: boolean;
   skeleton?: boolean;
   form?: (e?: Event) => void | Promise<void>;
   validate?: (valid: boolean) => void | boolean;
};

// states
const props = withDefaults(defineProps<TContainer & TProps>(), {
   loading: false,
   error: false,
   skeleton: true,
   overlay: false
});
const formRef = ref<any>();

// handlers
const submitHandler = async (e?: Event) => {
   let valid = true;

   if (formRef.value) {
      const result = await formRef.value.validate();
      valid = result.valid;
   }

   if (props.validate) {
      props.validate(valid);
   }

   if (!valid) {
      return;
   }

   if (props.form) {
      await props.form(e);
   }
};

defineExpose({
   form: formRef,
   validate: () => formRef.value?.validate(),
   isValid: () => formRef.value?.isValid
});
</script>
