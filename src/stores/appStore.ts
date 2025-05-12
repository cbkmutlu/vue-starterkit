export const useAppStore = defineStore("appStore", () => {
   const componentLoading = ref(false);
   const layoutLoading = ref(false);
   const localeLoading = ref(false);
   const progressLoading = ref(false);

   const actions = {
      setComponentLoading(value: boolean) {
         componentLoading.value = value;
      },
      setLayoutLoading(value: boolean) {
         layoutLoading.value = value;
      },
      setLocaleLoading(value: boolean) {
         localeLoading.value = value;
      },
      setProgressLoading(value: boolean) {
         progressLoading.value = value;
      }
   };

   return {
      componentLoading: computed(() => componentLoading.value),
      layoutLoading: computed(() => layoutLoading.value),
      localeLoading: computed(() => localeLoading.value),
      progressLoading: computed(() => progressLoading.value),
      ...actions
   };
});
