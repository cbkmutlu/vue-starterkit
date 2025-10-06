export const usePromptStore = defineStore("promptStore", () => {
   const dialog = ref({ ...TDialog });

   const actions = {
      open(payload?: { [K in keyof typeof TDialog]?: (typeof TDialog)[K] }) {
         dialog.value = { ...dialog.value, ...payload, show: true };

         return new Promise((resolve, reject) => {
            dialog.value.resolve = resolve;
            dialog.value.reject = reject;
         });
      },
      accept() {
         dialog.value.request = true;
         dialog.value.resolve(true);
      },
      close() {
         dialog.value.show = false;
         dialog.value.resolve(false);
      },
      reset() {
         dialog.value = { ...TDialog };
      }
   };

   return {
      dialog: computed(() => dialog.value),
      ...actions
   };
});
