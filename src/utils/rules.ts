export const appRules = {
   required(msg: string | ((msg: string) => string) = "This field is required") {
      return (v: any) => {
         const regex = Array.isArray(v) ? v.length > 0 : v && !!v;
         return regex || (typeof msg === "function" ? msg("rules.required") : msg);
      };
   },
   space(msg: string | ((msg: string) => string) = "This field cannot contain spaces") {
      return (v: any) => {
         const regex = v && !/\s/.test(v);
         return regex || (typeof msg === "function" ? msg("rules.space") : msg);
      };
   },
   maxlen(len: number, msg: string | ((msg: string) => string) = "This field exceeds maximum length") {
      return (v: any) => {
         const regex = v && v.length <= len;
         return regex || (typeof msg === "function" ? msg("rules.maxlen") : msg);
      };
   },
   minlen(len: number, msg: string | ((msg: string) => string) = "This field is too short") {
      return (v: any) => {
         const regex = v && v.length >= len;
         return regex || (typeof msg === "function" ? msg("rules.minlen") : msg);
      };
   },
   maxval(len: number, msg: string | ((msg: string) => string) = "This field exceeds maximum value") {
      return (v: any) => {
         const regex = v && v <= len;
         return regex || (typeof msg === "function" ? msg("rules.maxval") : msg);
      };
   },
   minval(len: number, msg: string | ((msg: string) => string) = "This field is below the minimum value") {
      return (v: any) => {
         const regex = v && v >= len;
         return regex || (typeof msg === "function" ? msg("rules.minval") : msg);
      };
   },
   fullip(msg: string | ((msg: string) => string) = "Please enter a valid IP address and optional port") {
      return (v: any) => {
         const ip = "(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
         const port = "(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{0,3})";
         const regex = v && v.match(new RegExp(`^${ip}\\.${ip}\\.${ip}\\.${ip}(?::${port})?$`));
         return regex || (typeof msg === "function" ? msg("rules.fullip") : msg);
      };
   },
   ip(msg: string | ((msg: string) => string) = "Please enter a valid IP address") {
      return (v: any) => {
         const ip = "(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
         const regex = v && v.match(new RegExp(`^${ip}\\.${ip}\\.${ip}\\.${ip}$`));
         return regex || (typeof msg === "function" ? msg("rules.ip") : msg);
      };
   },
   port(msg: string | ((msg: string) => string) = "Please enter a valid port") {
      return (v: any) => {
         const port = "(6553[0-5]|655[0-2][0-9]|65[0-4][0-9]{2}|6[0-4][0-9]{3}|[1-5][0-9]{4}|[1-9][0-9]{0,3})";
         const regex = v && v.match(new RegExp(`^${port}$`));
         return regex || (typeof msg === "function" ? msg("rules.port") : msg);
      };
   },
   email(msg: string | ((msg: string) => string) = "Please enter a valid email address") {
      return (v: any) => {
         const regex = v && v.match(new RegExp(/^(?!\.)[a-zA-Z0-9._%+-]+@(?!-)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?<!-)$/));
         return regex || (typeof msg === "function" ? msg("rules.email") : msg);
      };
   },
   integer(msg: string | ((msg: string) => string) = "This field must be an integer") {
      return (v: any) => {
         const regex = v && Number.isInteger(Number(v.replace(/\.$/, "a")));
         return regex || (typeof msg === "function" ? msg("rules.integer") : msg);
      };
   },
   number(msg: string | ((msg: string) => string) = "Please enter a valid number") {
      return (v: any) => {
         const regex = v && !Number.isNaN(Number(v.replace(/^\.|\.$/g, "a")));
         return regex || (typeof msg === "function" ? msg("rules.number") : msg);
      };
   },
   alpha(msg: string | ((msg: string) => string) = "This field must contain only letters") {
      return (v: any) => {
         const regex = v && /^\p{L}+$/u.test(v);
         return regex || (typeof msg === "function" ? msg("rules.alpha") : msg);
      };
   },
   alphaNum(msg: string | ((msg: string) => string) = "This field must contain only letters and numbers") {
      return (v: any) => {
         const regex = v && /^[a-zA-Z0-9]+$/.test(v);
         return regex || (typeof msg === "function" ? msg("rules.alphaNum") : msg);
      };
   }
};
