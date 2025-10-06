export const useSnackbarStore = defineStore("snackbarStore", () => {
   const queue = ref([] as TSnackbar[]);
   const { t } = i18n.global;

   const actions = {
      /**
       * Mesaj ekler.
       * @param text Text to display
       * @param color Color of the snackbar
       * @param timeout Timeout in milliseconds
       */
      add({ text, color, timeout = 2000 }: TSnackbar) {
         queue.value.push({ text, color, timeout });
      },
      /**
       * Hata mesajı ekler.
       * @param text text.message || text.error || t("app.recordFailed")
       */
      error(text: any, timeout = 2000) {
         queue.value.push({ text: text.message || text.error || t("app.recordFailed"), color: "error", timeout });
      }
   };

   return {
      queue,
      ...actions
   };
});
