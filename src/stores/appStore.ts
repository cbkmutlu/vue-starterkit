export const useAppStore = defineStore("appStore", () => {
   const componentLoading = ref(false);
   const layoutLoading = ref(false);
   const menuLoading = ref(false);
   const localeLoading = ref(false);
   const breadcrumb = ref({} as Record<string, string>);
   const menu = ref({} as Record<string, TList[]>);
   const module = ref();

   const actions = {
      setComponentLoading(value: boolean) {
         componentLoading.value = value;
      },
      setLayoutLoading(value: boolean) {
         layoutLoading.value = value;
      },
      setMenuLoading(value: boolean) {
         menuLoading.value = value;
      },
      setLocaleLoading(value: boolean) {
         localeLoading.value = value;
      },
      setBreadcrumb(key: string, value: any) {
         breadcrumb.value[key] = value;
      },
      setMenu(value: Record<string, TList[]>) {
         menu.value = value;
      },
      setModule(value: string) {
         module.value = value;
      }
   };

   return {
      componentLoading: computed(() => componentLoading.value),
      layoutLoading: computed(() => layoutLoading.value),
      menuLoading: computed(() => menuLoading.value),
      localeLoading: computed(() => localeLoading.value),
      breadcrumb: computed(() => breadcrumb.value),
      menu: computed(() => menu.value),
      module: computed(() => module.value),
      ...actions
   };
});
