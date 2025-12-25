import { router } from "@/plugins/router";
import {
   _ExtractActionsFromSetupStore,
   _ExtractGettersFromSetupStore,
   _ExtractStateFromSetupStore,
   _GettersTree,
   DefineSetupStoreOptions,
   defineStore,
   DefineStoreOptions,
   StateTree,
   StoreDefinition
} from "pinia";
import { DeepReadonly } from "vue";

// options store with id
export function defineImmutableStore<Id extends string, S extends StateTree = {}, G extends _GettersTree<S> = {}, A = {}>(
   id: Id,
   options: Omit<DefineStoreOptions<Id, S, G, A>, "id">
): StoreDefinition<Id, Readonly<S>, G, A>;

// options store
export function defineImmutableStore<Id extends string, S extends StateTree = {}, G extends _GettersTree<S> = {}, A = {}>(
   options: DefineStoreOptions<Id, S, G, A>
): StoreDefinition<Id, Readonly<S>, G, A>;

// setup store
export function defineImmutableStore<Id extends string, SS>(
   id: Id,
   storeSetup: () => SS,
   options?: DefineSetupStoreOptions<Id, DeepReadonly<_ExtractStateFromSetupStore<SS>>, _ExtractGettersFromSetupStore<SS>, _ExtractActionsFromSetupStore<SS>>
): StoreDefinition<Id, Readonly<_ExtractStateFromSetupStore<SS>>, _ExtractGettersFromSetupStore<SS>, _ExtractActionsFromSetupStore<SS>>;

// implementation
export function defineImmutableStore(idOrOptions: any, setupOrOptions?: any, maybeOptions?: any) {
   return defineStore(idOrOptions, setupOrOptions, maybeOptions);
}

export const pinia = createPinia();

pinia.use(persistedstate);
pinia.use(({ store }) => {
   store.$router = markRaw(router);
});
