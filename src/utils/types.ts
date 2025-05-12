// vuetify
import type { VDataTable, VDatePicker, VList, VListItem, VSelect, VTextField, VToolbar } from "vuetify/components";
/* @vue-ignore */
type ReadonlyArray<A> = A extends Readonly<Array<infer I>> ? I : A;

export type TList = ReadonlyArray<Omit<VList["$props"], "itemProps">> & {
   itemType?: "subheader" | "divider";
   itemProps?: ReadonlyArray<VListItem["$props"]> & {
      icon?: string;
   };
   children?: TList[];
};

export type TDataTable = ReadonlyArray<VDataTable["$props"]>;

export type TMultiSelect = ReadonlyArray<VSelect["$props"]>;

export type TToolBar = ReadonlyArray<VToolbar["$props"]>;

export type TDateField = ReadonlyArray<VDatePicker["$props"]> & ReadonlyArray<VTextField["$props"]>;

export type TField = ReadonlyArray<VTextField["$props"]>;

// enums
export enum EButton {
   RecordVariant = "text",
   RecordDensity = "comfortable"
}

export enum EToast {
   Success = "success",
   Error = "error",
   Danger = "danger",
   Warning = "warning"
}

export enum EUser {
   "user" = 300,
   "admin" = 400
}

// interfaces
export interface IResponse {
   code: number;
   message: string;
   data: unknown;
}

export interface IStatus {
   isError: boolean | number;
   isPending: boolean;
   isSuccess: boolean;
}

export interface IHeader<T> {
   title?: string;
   key?: keyof T;
   width?: string;
   value?: string;
   sortable?: boolean;
   prepend?: boolean;
   append?: boolean;
   filterable?: boolean;
   selectable?: boolean;
   orderable?: boolean;
   format?: (value: any) => string;
}

export interface IToast {
   id?: number;
   title?: string;
   message?: string | null;
   date?: string | null;
   type?: string;
   timeout?: number;
   show?: boolean;
}

// typeof initial values
export const TDialog = {
   show: false,
   loading: false,
   request: false,
   focus: false,
   validate: false,
   title: "",
   titleColor: "primary",
   acceptText: "",
   acceptColor: "",
   acceptVariant: undefined,
   cancelText: "",
   cancelColor: "error",
   cancelVariant: undefined,
   label: "",
   message: "",
   rules: [] as unknown as Array<any>,
   width: 320,
   callback: Function as (item: any) => any,
   resolve: (_value: boolean) => {},
   reject: (_value: boolean) => {}
};
