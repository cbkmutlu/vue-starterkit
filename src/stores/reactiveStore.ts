export const useReactiveStore = defineStore("reactiveStore", () => {
   const state = reactive({
      count: 0,
      message: "Hello, Pinia!"
   });

   const getters = {
      doubleCount: computed(() => state.count * 2),
      uppercaseMessage: computed(() => state.message.toUpperCase())
   };

   const actions = {
      increment() {
         state.count++;
      },
      setCount(newCount: number) {
         state.count = newCount;
      },
      setMessage(newMessage: string) {
         state.message = newMessage;
      }
   };

   type State = typeof state;
   const readonlyState = Object.fromEntries(Object.keys(state).map((key) => [key, computed(() => state[key as keyof State])])) as {
      [K in keyof State]: ComputedRef<State[K]>;
   };

   return {
      ...readonlyState,
      ...getters,
      ...actions
   };
});
