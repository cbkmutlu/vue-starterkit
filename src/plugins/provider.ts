import type { App } from "vue";

export const registerProvider = (app: App) => {
   app.provide(
      "globalProvider",
      setProvider({
         state: {
            globalState: ""
         },
         methods: {
            setGlobalState(state: { [key: string]: string }, value: string) {
               state.globalState = value;
            }
         }
      })
   );
};
