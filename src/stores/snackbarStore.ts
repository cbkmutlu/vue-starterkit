export const useSnackbarStore = defineStore("snackbarStore", () => {
   const queue = ref([] as any);
   const { t } = useI18n();

   const actions = {
      /**
       * Mesaj ekler.
       * @param text Text to display
       * @param color Color of the snackbar
       * @param timeout Timeout in milliseconds
       */
      add({ text, color = undefined, variant = "flat", timeout = 2000 }: TSnackbar) {
         queue.value.push({ text, color, timeout, variant });
      },
      /**
       * Hata mesajı ekler.
       * @param text text.message || text.error
       */
      error(text: any = t("app.recordFailed"), variant?: string, timeout?: number) {
         this.add({ text: text.message || text.error || t("app.recordFailed"), color: "error", variant, timeout });
      },
      /**
       * Başarılı mesajı ekler.
       * @param text text.message || text.error
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
