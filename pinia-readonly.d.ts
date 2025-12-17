import { DeepReadonly } from "vue";

declare module "pinia" {
   export declare function defineStore<Id extends string, S extends StateTree = {}, G extends _GettersTree<S> = {}, A = {}>(
      id: Id,
      options: Omit<DefineStoreOptions<Id, S, G, A>, "id">
   ): StoreDefinition<Id, DeepReadonly<S>, G, A>;

   export declare function defineStore<Id extends string, S extends StateTree = {}, G extends _GettersTree<S> = {}, A = {}>(
      options: DefineStoreOptions<Id, S, G, A>
   ): StoreDefinition<Id, DeepReadonly<S>, G, A>;

   export declare function defineStore<Id extends string, SS>(
      id: Id,
      storeSetup: () => SS,
      options?: DefineSetupStoreOptions<Id, DeepReadonly<_ExtractStateFromSetupStore<SS>>, _ExtractGettersFromSetupStore<SS>, _ExtractActionsFromSetupStore<SS>>
   ): StoreDefinition<Id, DeepReadonly<_ExtractStateFromSetupStore<SS>>, _ExtractGettersFromSetupStore<SS>, _ExtractActionsFromSetupStore<SS>>;
}
