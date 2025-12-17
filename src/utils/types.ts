import { AllowedComponentProps, VNodeProps } from "@vue/runtime-dom";
/* @vue-ignore */
type ComponentProps<C extends Component> = C extends new (...args: any) => any ? Omit<InstanceType<C>["$props"], keyof VNodeProps | keyof AllowedComponentProps> : never;
export type Neverify<T> = { [K in keyof T]?: never };
export type UnwrapReadonlyArray<A> = A extends Readonly<Array<infer I>> ? I : A;
export type NestedKeys<T> = T extends object ? { [K in keyof T & string]: K | `${K}.${NestedKeys<T[K]>}` }[keyof T & string] : never;
export type Strict<T> = { [K in keyof T]: T[K] extends object ? Strict<T[K]> & Record<string, never> : T[K] };

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

export interface IListImage {
   id: number;
   image_path: string;
}

export interface IOrderStore {
   id: number;
   order: number;
}

export type THeader<T> = {
   title?: string;
   key?: NestedKeys<T> | "actions";
   width?: number;
   minWidth?: number;
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
   prefix?: string;
   suffix?: string;
   format?: (value: any) => string;
   merge?: string[];
   enum?: any;
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
   variant?: string;
   timeout?: number;
};

// response
export type TResponse<T = any> = {
   success: boolean;
   message?: string;
   data: T;
   error: any;
   meta: any;
   status: number;
};

// tanstack
export type TParams = {
   id?: Ref<number>;
   language?: Ref<string | number>;
   page?: MaybeRef<string | number>;
   query?: MaybeRef<string>;
   sort?: MaybeRef<string>;
   order?: MaybeRef<string>;
   filter?: MaybeRef<string>;
   limit?: MaybeRef<string | number>;
   status?: MaybeRef<string | number>;
   start_date?: MaybeRef<Date>;
   end_date?: MaybeRef<Date>;
   type?: MaybeRef<string | number>;
   path?: MaybeRef<string>;
};

export type TQuery<T> = {
   onSuccess?: (data: T) => void;
   onError?: (error: any) => void;
   enabled?: Ref<boolean>;
   params?: TParams;
};

export type TMutation = {
   id?: MaybeRef<number>;
   invalidate?: MaybeRef<string | number>[];
};

import { VAlert, VAvatar, VBtn, VCard, VContainer, VDataTable, VDatePicker, VListItem, VSelect, VTextField, VToolbar } from "vuetify/components";
/* @ts-ignore */ type TListBase = {
   title?: string | (() => string);
   subtitle?: string | (() => string);
   type?: "subheader";
   props?: Partial<ComponentProps<typeof VListItem>>;
};
/* @ts-ignore */ type TListWithChildren = TListBase & {
   props: Partial<ComponentProps<typeof VListItem>> & {
      value: string;
   };
   children: TList[];
};

/* @ts-ignore */ type TListWithoutChildren = TListBase & {
   props?: Partial<ComponentProps<typeof VListItem>>;
   children?: undefined;
};
/* @ts-ignore */ type TListDivider = {
   type: "divider";
   title?: undefined;
   subtitle?: undefined;
   props?: undefined;
   children?: undefined;
};
/* @ts-ignore */ export type TList = TListWithChildren | TListWithoutChildren | TListDivider;
/* @ts-ignore */ export type TDataTable = Partial<ComponentProps<typeof VDataTable>>;
/* @ts-ignore */ export type TMultiSelect = Partial<ComponentProps<typeof VSelect>>;
/* @ts-ignore */ export type TDateField = Partial<ComponentProps<typeof VDatePicker>> & Partial<ComponentProps<typeof VTextField>>;
/* @ts-ignore */ export type TToolbar = Partial<ComponentProps<typeof VToolbar>>;
/* @ts-ignore */ export type TCard = Partial<ComponentProps<typeof VCard>>;
/* @ts-ignore */ export type TContainer = Partial<ComponentProps<typeof VContainer>>;
/* @ts-ignore */ export type TBtn = Partial<ComponentProps<typeof VBtn>>;
/* @ts-ignore */ export type TField = Partial<ComponentProps<typeof VTextField>>;
/* @ts-ignore */ export type TAvatar = Partial<ComponentProps<typeof VAvatar>>;
/* @ts-ignore */ export type TAlert = Partial<ComponentProps<typeof VAlert>>;

export const TDialog = {
   show: false,
   loading: false as boolean | MaybeRef<boolean>,
   image: "" as string | MaybeRef<string>,
   request: false,
   delete: false,
   validate: false,
   title: "",
   label: "",
   content: "",
   prompt: "",
   titleColor: "transparent",
   acceptText: "",
   acceptColor: "primary",
   acceptVariant: "tonal" as const,
   cancelText: "",
   cancelColor: "error",
   cancelVariant: undefined,
   deleteText: "",
   deleteColor: "error",
   deleteVariant: "tonal" as const,
   rules: [] as any[],
   detail: false,
   width: 320,
   mask: {},
   onDelete: null as unknown as (item: any) => any,
   onInput: null as unknown as (item: any) => any,
   resolve: null as unknown as (item: any) => any,
   reject: null as unknown as (item: any) => any
};
