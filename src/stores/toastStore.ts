const { t } = i18n.global;

let defaultTimeout: any = [];
export const useToastStore = defineStore("toastStore", {
   state: () => ({
      toast: [] as IToast[],
      toastCount: 0
   }),
   actions: {
      add(payload: IToast, callback?: (id: number, timeout: number) => void) {
         const id = this.toastCount++;
         const timeout = payload!.timeout || 3000;

         this.toast.push({
            id: id,
            title: payload.title || t("notification"),
            message: payload.message || null,
            date: payload.date || null,
            type: payload.type || EToast.Success,
            timeout: timeout,
            show: true
         });

         defaultTimeout[id] = setTimeout(() => this.delete(id), timeout);
         callback?.call(this, id, timeout);
      },
      delete(id: number) {
         const index = this.toast.findIndex((toast: IToast) => toast.id === id);
         if (index !== -1) {
            this.toast.splice(index, 1);
            clearTimeout(defaultTimeout[id]);
         }
         if (this.toast.length === 0) {
            this.toastCount = 0;
         }
      }
   }
});
