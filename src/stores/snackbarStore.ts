export const useSnackbarStore = defineStore("snackbarStore", () => {
   const queue = ref([] as any);
   const { t } = useI18n();

   const actions = {
      /**
       * @param text Text to display
       * @param color Color of the snackbar
       * @param timeout Timeout in milliseconds
       */
      add({ text, color = undefined, variant = "flat", timeout = 2000 }: TSnackbar) {
         if (typeof text === "object") {
            queue.value.push({ text: JSON.stringify(Object.values(text).flat()), color, timeout, variant });
         } else {
            queue.value.push({ text, color, timeout, variant });
         }
      },
      /**
       * @param text text.error || text.message
       */
      error(text: any = t("app.recordFailed"), variant?: string, timeout?: number) {
         this.add({ text: text.error || text.message || text, color: "error", variant, timeout });
      },
      /**
       * @param text
       */
      success(text: any = t("app.recordSuccess"), variant?: string, timeout?: number) {
         this.add({ text, variant, timeout });
      }
   };

   return {
      queue,
      ...actions
   };
});
