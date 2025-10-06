export interface IListImage {
   id: number;
   image_path: string;
}

export interface IDefaultFields {
   created_at: string;
   updated_at: string;
   deleted_at: string;
   deleted_by: number;
   created_by: number;
   updated_by: number;
}

export interface ITranslate {
   language_id: number;
   title?: string;
   content?: string;
   url?: string;
   meta_title?: string;
   meta_description?: string;
   meta_keywords?: string;
}

type NestedKeys<T> = T extends object ? { [K in keyof T & string]: K | `${K}.${NestedKeys<T[K]>}` }[keyof T & string] : never;

export type THeader<T> = {
   title?: string;
   key?: NestedKeys<T> | "actions";
   width?: string;
   value?: string;
   sortable?: boolean;
   align?: "start" | "center" | "end";
   filterable?: boolean;
   selectable?: boolean;
   orderable?: boolean;
   /**
    * https://vuetifyjs.com/en/features/dates/#format-options
    */
   date?: string;
};

export type TNotify = {
   id?: number;
   title?: string;
   message?: string | null;
   date?: string | null;
   type?: string;
   timeout?: number;
   show?: boolean;
};

export type TSnackbar = {
   text: string;
   color?: string;
   timeout?: number;
};

export const TDialog = {
   show: false,
   loading: false as boolean | MaybeRef<boolean>,
   request: false,
   focus: false,
   validate: false,
   title: "",
   titleColor: "transparent",
   acceptText: "",
   acceptColor: "primary",
   acceptVariant: "tonal" as const,
   cancelText: "",
   cancelColor: "error",
   cancelVariant: undefined,
   label: "",
   message: "",
   rules: [] as any[],
   width: 320,
   callback: Function as (item: any) => any,
   resolve: (_value: boolean) => {},
   reject: (_value: boolean) => {}
};
