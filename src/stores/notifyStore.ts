const { t } = i18n.global;

let defaultTimeout: any[] = [];
export const useNotifyStore = defineStore("notifyStore", {
   state: () => ({
      notify: [] as TNotify[],
      notifyCount: 0
   }),
   actions: {
      add(payload: TNotify, callback?: (id: number, timeout: number) => void) {
         const id = this.notifyCount++;
         const timeout = payload!.timeout || 3000;

         this.notify.push({
            id: id,
            title: payload.title || t("app.notify"),
            message: payload.message || null,
            date: payload.date || null,
            type: payload.type || ENotify.Success,
            timeout: timeout,
            show: true
         });

         defaultTimeout[id] = setTimeout(() => this.delete(id), timeout);
         callback?.call(this, id, timeout);
      },
      delete(id: number) {
         const index = this.notify.findIndex((notify: TNotify) => notify.id === id);
         if (index !== -1) {
            this.notify.splice(index, 1);
            clearTimeout(defaultTimeout[id]);
         }
         if (this.notify.length === 0) {
            this.notifyCount = 0;
         }
      }
   }
});
