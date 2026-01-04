import { i18n } from "@/plugins/i18n";

export const appRules = {
   required(msg?: string) {
      return (v: any): true | string => {
         if (Array.isArray(v)) {
            return v.length > 0 || i18n.global.t(msg || "rules.required");
         }

         const isValid = v !== null && v !== undefined && v !== "";
         return isValid || msg || i18n.global.t("rules.required");
      };
   },
   sameAs(getTarget: () => any, msg?: string) {
      return (v: any): true | string => {
         if (v == null || v === "") {
            return true;
         }

         const target = getTarget();
         const isValid = v === target;

         return isValid || msg || i18n.global.t("rules.sameAs");
      };
   },
   space(msg?: string) {
      return (v: any): true | string => {
         if (v == null || v === "") {
            return true;
         }

         const isValid = !/\s/.test(v);
         return isValid || msg || i18n.global.t("rules.space");
      };
   },
   maxlen(len: number, msg?: string) {
      return (v: any): true | string => {
         if (v == null || v === "") {
            return true;
         }

         const isValid = v.length <= len;
         return isValid || msg || i18n.global.t("rules.maxlen");
      };
   },
   minlen(len: number, msg?: string) {
      return (v: any): true | string => {
         if (v == null || v === "") {
            return true;
         }

         const isValid = v.length >= len;
         return isValid || msg || i18n.global.t("rules.minlen", { len });
      };
   },
   maxval(val: number, msg?: string) {
      return (v: any): true | string => {
         if (v == null || v === "") {
            return true;
         }

         const isValid = v <= val;
         return isValid || msg || i18n.global.t("rules.maxval", { val });
      };
   },
   minval(val: number, msg?: string) {
      return (v: any): true | string => {
         if (v == null || v === "") {
            return true;
         }

         const isValid = v >= val;
         return isValid || msg || i18n.global.t("rules.minval", { val });
      };
   },
   fullip(msg?: string) {
      return (v: any): true | string => {
         if (v == null || v === "") {
            return true;
         }

         const ip = "(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
         const port = "(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{0,3})";
         const regex = new RegExp(`^${ip}\\.${ip}\\.${ip}\\.${ip}(?::${port})?$`);

         const isValid = regex.test(v);
         return isValid || msg || i18n.global.t("rules.fullip");
      };
   },
   ip(msg?: string) {
      return (v: any): true | string => {
         if (v == null || v === "") {
            return true;
         }

         const ip = "(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
         const regex = new RegExp(`^${ip}\\.${ip}\\.${ip}\\.${ip}$`);

         const isValid = regex.test(v);
         return isValid || msg || i18n.global.t("rules.ip");
      };
   },
   port(msg?: string) {
      return (v: any): true | string => {
         if (v == null || v === "") {
            return true;
         }

         const port = "(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{0,3})";
         const regex = new RegExp(`^${port}$`);

         const isValid = regex.test(v);
         return isValid || msg || i18n.global.t("rules.port");
      };
   },
   email(msg?: string) {
      return (v: any): true | string => {
         if (v == null || v === "") {
            return true;
         }

         const isValid = /^(?!\.)[a-zA-Z0-9._%+-]+@(?!-)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?<!-)$/.test(v);
         return isValid || msg || i18n.global.t("rules.email");
      };
   },
   integer(msg?: string) {
      return (v: any): true | string => {
         if (v == null || v === "") {
            return true;
         }

         const isValid = Number.isInteger(Number(v)) && !String(v).includes(".");
         return isValid || msg || i18n.global.t("rules.integer");
      };
   },
   float(msg?: string) {
      return (v: any): true | string => {
         if (v == null || v === "") {
            return true;
         }

         const value = String(v);

         const isValid = !Number.isNaN(Number(value)) && value.includes(".") && value !== ".";
         return isValid || msg || i18n.global.t("rules.float");
      };
   },
   number(msg?: string) {
      return (v: any): true | string => {
         if (v == null || v === "") {
            return true;
         }

         const value = String(v);

         const isValid = !Number.isNaN(Number(value)) && value !== ".";
         return isValid || msg || i18n.global.t("rules.number");
      };
   },
   string(msg?: string) {
      return (v: any): true | string => {
         if (v == null || v === "") {
            return true;
         }

         const isValid = /^\p{L}+$/u.test(String(v));
         return isValid || msg || i18n.global.t("rules.string");
      };
   },
   stringNumber(msg?: string) {
      return (v: any): true | string => {
         if (v == null || v === "") {
            return true;
         }

         const isValid = /^[a-zA-Z0-9]+$/.test(String(v));
         return isValid || msg || i18n.global.t("rules.stringNumber");
      };
   },
   stringDash(msg?: string) {
      return (v: any): true | string => {
         if (v == null || v === "") {
            return true;
         }

         const isValid = /^[a-zA-Z-]+$/.test(String(v));
         return isValid || msg || i18n.global.t("rules.stringDash");
      };
   },
   stringNumberDash(msg?: string) {
      return (v: any): true | string => {
         if (v == null || v === "") {
            return true;
         }

         const isValid = /^[a-zA-Z0-9-]+$/.test(String(v));
         return isValid || msg || i18n.global.t("rules.stringNumberDash");
      };
   },
   lowercase(msg?: string) {
      return (v: any): true | string => {
         if (v == null || v === "") {
            return true;
         }

         const isValid = /^[a-z]+$/.test(String(v));
         return isValid || msg || i18n.global.t("rules.lowercase");
      };
   },
   uppercase(msg?: string) {
      return (v: any): true | string => {
         if (v == null || v === "") {
            return true;
         }

         const isValid = /^[A-Z]+$/.test(String(v));
         return isValid || msg || i18n.global.t("rules.uppercase");
      };
   },
   pattern(pattern: RegExp, msg?: string) {
      return (v: any): true | string => {
         if (v == null || v === "") {
            return true;
         }

         const isValid = pattern.test(String(v));
         return isValid || msg || i18n.global.t("rules.pattern");
      };
   }
};
