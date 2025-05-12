// getComponent(() => import("../components/Loader/LayoutLoader.vue"))
export const getComponent = (component: () => Promise<Component>): (() => Promise<Component>) => {
   return async () => {
      const appStore = useAppStore();
      appStore.setComponentLoading(true);

      return await component().then((mod) => mod);
   };
};

// getComponentAsync("component.vue", ErrorLayout)
export const getComponentAsync = (component: string, error: Component): Component => {
   const appStore = useAppStore();

   return defineAsyncComponent({
      loader: async () => {
         // await timerSleep(5000);
         return await import(`@/assets/layouts/${component}/Layout.vue`).then((mod) => {
            appStore.setLayoutLoading(false);
            return mod.default;
         });
      },
      onError(error, retry, fail, attempts) {
         const retryDelay = timerAttempt(attempts - 1);

         if (error && attempts <= appConfig.retry.attempt) {
            setTimeout(() => {
               retry();
            }, retryDelay);
         } else {
            appStore.setLayoutLoading(false);
            fail();
         }
      },
      delay: 0,
      errorComponent: error
   });
};

// get query
export const getQuery = (key: any): { [key: string]: any } => {
   const queryClient = useQueryClient();
   return queryClient.getQueryData([key]) || [];
};

// prefetch query
export const prefetchQuery = async (key: string, callback: Function) => {
   const queryClient = useQueryClient();
   await queryClient.prefetchQuery({
      queryKey: [key],
      queryFn: callback.call(this)
   });
};

// setUserLocale("tr-TR")
export const setUserLocale = (locale: string) => {
   document.documentElement.setAttribute("lang", locale);
   localStorage.setItem(appConfig.key.locale, locale);
   i18n.global.locale.value = locale;
};

// getUserLocale() => localStorage[VITE_KEY_LOCALE] || VITE_DEFAULT_LOCALE
export const getUserLocale = (fallback: boolean = true) => {
   const locale = localStorage.getItem(appConfig.key.locale);

   if (fallback) {
      if (locale && Object.keys(appConfig.support.locale).includes(locale)) {
         return locale;
      }

      return appConfig.default.locale;
   }

   return locale || (null as any);
};

// loadLocales("tr-TR")
const json: string[] = [];
export const loadLocales = async (locale: string): Promise<void> => {
   try {
      if (!json.includes(locale)) {
         const commonPromise = import(`@/locales/${locale}.json`).then((res) => res.default);
         const modulePromise = appConfig.support.module.map((item) => import(`@/modules/${item}/locales/${locale}.json`).then((res) => res.default));
         const vuetifyPromise = await import(`vuetify/locale`).then((res: any) => res[locale.split("-")[0].toLowerCase()]);

         const [commonLocales, vuetifyLocales, ...moduleMap] = await Promise.all([commonPromise, vuetifyPromise, ...modulePromise]);
         const moduleLocales = Object.assign({}, ...moduleMap);

         i18n.global.setLocaleMessage(locale, { ...moduleLocales, ...commonLocales, $vuetify: { ...vuetifyLocales } });
         json.push(locale);
      }
   } catch (error) {
      throw error;
   }

   return nextTick();
};

// fetchLocales
export const fetchLocales = async () => {};

// setUserTheme(theme, "dark") => pass true for toggle between dark and light
export const setUserTheme = (theme: ThemeInstance, mode: "light" | "dark" | true): void => {
   if (mode === true) {
      mode = theme.global.name.value === "dark" ? "light" : "dark";
   }

   theme.global.name.value = mode;
   localStorage.setItem(appConfig.key.theme, mode);
};

// getUserTheme() => localStorage[appConfig.key.theme] || appConfig.default.theme
export const getUserTheme = (): string => {
   const theme = localStorage.getItem(appConfig.key.theme);
   return theme && ["light", "dark"].includes(theme) ? theme : appConfig.default.theme;
};

// formatString("This is {0}", ["replaced"]) => "This is replaced"
// formatString("This {0} {1,1}", ["is", ["any string", "replaced"]]) => "This is replaced"
export const formatString = (format: string, args: any[]): string => {
   return format.replace(/{(\d+)(?:,(\d+))?}/g, (match, index, sub) => {
      let value = args[index];

      if (typeof sub !== "undefined" && Array.isArray(value)) {
         value = value[sub];
      }

      return typeof value !== "undefined" ? value : match;
   });
};

// formatPadding(-1) => "-01"
// formatPadding(9) => "09"
export const formatPadding = (value: number, pad: number = 2): string => {
   const result = String(Math.abs(value)).padStart(pad, "0");
   return value < 0 ? "-" + result : result;
};

// formatCounter(1000) => 1k
// formatCounter(10000) => 10k
export const formatCounter = (num: number): string => {
   if (num < 1000) {
      return num.toString();
   }

   const units = ["k", "m", "b", "t"];
   const exp = Math.floor(Math.log(num) / Math.log(1000));

   return num / Math.pow(1000, exp) + units[exp - 1];
};

// formatSize(1024) => 1KB
// formatSize(1024 * 1024) => 1MB
export const formatSize = (bytes: number): string => {
   if (bytes < 1024) {
      return bytes.toString() + "B";
   }

   const units = ["B", "KB", "MB", "GB", "TB", "PB"];
   const exp = Math.floor(Math.log(bytes) / Math.log(1024));

   return parseFloat((bytes / Math.pow(1024, exp)).toFixed(3)) + units[exp];
};

// formatDate(new Date()) => Apr 25, 1986
// formatDate(new Date(), { dateStyle: "full" }) => Friday, Apr 25, 2025
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
export const formatDate = (date: Date | string, options: Intl.DateTimeFormatOptions = {}, locale: string = getUserLocale()): string | null => {
   const { dateStyle, timeStyle } = options;
   const defaultOptions = {
      ...(appConfig.format.date as Intl.DateTimeFormatOptions),
      ...options
   };

   if (!date) {
      return null;
   }

   if (date instanceof Date === false) {
      date = new Date(date);
   }

   if (isNaN(date.getTime())) {
      return null;
   }

   return new Intl.DateTimeFormat(locale, dateStyle || timeStyle ? options : defaultOptions).format(date);
};

// formatMS(date) => 1986-04-25 00:00:00:999
export const formatMS = (date: Date): void => {
   if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0 && date.getMilliseconds() === 0) {
      date.setMilliseconds(999);
   }
};

// formatOklch("oklch(0.359 0.144 278.697)")
export const formatOklch = (color: string): string => {
   // Regex to extract the values from the oklch() string
   const match = color.match(/oklch\(([\d.]+%)\s([\d.]+)\s([\d.]+)/);
   if (!match) throw new Error("Invalid OKLCH color format");

   // Parse the values from the regex match
   const L = parseFloat(match[1]) / 100;
   const C = parseFloat(match[2]);
   const H = (parseFloat(match[3]) * Math.PI) / 180;

   // OKLCH to OKLab
   const a = C * Math.cos(H);
   const b = C * Math.sin(H);

   // OKLab to linear sRGB
   const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
   const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
   const s_ = L - 0.0894841775 * a - 1.291485548 * b;

   const l = Math.pow(l_, 3);
   const m = Math.pow(m_, 3);
   const s = Math.pow(s_, 3);

   // Linear sRGB to sRGB
   const r = Math.max(0, Math.min(1, +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s));
   const g = Math.max(0, Math.min(1, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s));
   const bColor = Math.max(0, Math.min(1, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s));

   // Convert to 8-bit per channel and format as hex
   const toHex = (value: number) => {
      const hex = Math.round(value * 255)
         .toString(16)
         .padStart(2, "0");
      return hex;
   };

   return `#${toHex(r)}${toHex(g)}${toHex(bColor)}`;
};

// generate random guid with timestamp
export const generateRandomGuid = (haystack?: string[]): string => {
   const timestamp = Date.now().toString(16).slice(-8);
   const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char: string) => {
      let rand = (Math.random() * 16) % 16 | 0;
      let result = char === "x" ? rand : (rand & 0x3) | 0x8;
      return result.toString(16);
   });

   if (haystack?.includes(uuid)) {
      return generateRandomGuid(haystack);
   }

   return uuid.slice(0, -8) + timestamp;
};

// generate random string with options
export const generateRandomString = (length: number = 8, options: { upperCase?: boolean; lowerCase?: boolean; numbers?: boolean } = {}): string => {
   const defaultOptions = {
      upperCase: true,
      lowerCase: true,
      numbers: true,
      ...options
   };
   const { upperCase, lowerCase, numbers } = defaultOptions;
   const characters = {
      upperCase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowerCase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789"
   };

   let result = "";
   if (numbers) {
      result = result.concat(characters.numbers);
   }

   if (upperCase) {
      result = result.concat(characters.upperCase);
   }

   if (lowerCase) {
      result = result.concat(characters.lowerCase);
   }

   return Array.from({ length }, () => result.charAt(Math.floor(Math.random() * result.length)))
      .sort(() => 0.5 - Math.random())
      .join("");
};

// callback with delay if next is not called
export const timerDebounce = (callback: (...args: any[]) => void, delay: number = 350, instant: any = true): Function => {
   let timeout: any = false;

   return (...args: any) => {
      if (timeout) {
         clearTimeout(timeout);
      } else if (instant) {
         callback(...args);
      }

      timeout = setTimeout(() => {
         callback(...args);
         timeout = false;
      }, delay);
   };
};

// callback with every delay
export const timerThrottle = (callback: any, delay: number, instant: any = true): object => {
   let timeout: any = false;
   let moment: any = false;
   return (...args: any) => {
      if (!moment) {
         if (timeout === false && instant) {
            callback.apply(this, args);
         }
         moment = Date.now();
      } else {
         clearTimeout(timeout);
         timeout = setTimeout(
            () => {
               if (Date.now() - moment >= delay) {
                  callback.apply(this, args);
                  moment = Date.now();
               }
            },
            delay - (Date.now() - moment)
         );
      }
   };
};

// timer for retry
export const timerAttempt = (attempt: number, max: number = 30000) => {
   if (appConfig.retry.gradual) {
      return Math.min(appConfig.retry.delay * 2 ** attempt, max);
   } else {
      return appConfig.retry.delay;
   }
};

// sleep with delay for animation
export const timerSleep = (delay: number = appConfig.default.sleep): Promise<void> => {
   return new Promise((resolve) => (delay ? setTimeout(resolve, delay) : resolve()));
};

export const createFormData = <T extends Record<string, any>>(form: T): FormData => {
   const formData = new FormData();

   for (const key in form) {
      if (form[key] !== undefined) {
         if (Array.isArray(form[key])) {
            form[key].forEach((item: any) => {
               formData.append(`${key}`, item);
            });
         } else {
            formData.append(key, form[key]);
         }
      }
   }

   return formData;
};

export const setInitialData = (items: any, key: string, value: any) => {
   const initialData: { [key: string]: any } = {};
   items.forEach((item: any) => (initialData[item[key]] = item.default || value));
   return initialData;
};

// inputRegex
export const inputRegex = (query: any = null, numeric: boolean = false) => {
   if (query === null) {
      return "";
   }

   const match = query.match(/^([><=!])\s*([\d.]+)$/);
   if (match && numeric) {
      const operator = match[1];
      const threshold = parseFloat(match[2]);
      return (value: any) => {
         return (
            value !== null &&
            typeof value === "number" &&
            ((operator === ">" && value > threshold) ||
               (operator === "<" && value < threshold) ||
               (operator === "=" && value === threshold) ||
               (operator === "!" && value !== threshold))
         );
      };
   }

   query = lowerCase(query)
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/\*/g, ".*")
      .replace(/\//g, "^")
      .replace(/[üÜuU]/g, "[üÜuU]")
      .replace(/[iİıI]/g, "[iİıI]")
      .replace(/[ğĞgG]/g, "[ğĞgG]")
      .replace(/[şŞsS]/g, "[şŞsS]")
      .replace(/[çÇcC]/g, "[çÇcC]")
      .replace(/[öÖoO]/g, "[öÖoO]");

   return new RegExp(`${query}`, "i");
};

// inputFilter
export const inputFilter = (items: any, query: any, _item?: any, numeric: boolean = false) => {
   const regex = inputRegex(query, numeric);

   if (typeof regex === "function") {
      return items !== null && query !== null && regex(items);
   }

   return items !== null && query !== null && items.search(regex) !== -1;
};

// https://vuejsdevelopers.com/2020/10/05/composition-api-vuex/
// setProvider(globalProvider)
export const setProvider = (provider: { [key: string]: any }) => {
   const state = ref(provider.state);

   const methods = Object.keys(provider.methods).reduce(
      (acc, methodName) => {
         acc[methodName] = function (...args: any) {
            const callback = args.findIndex((arg: any) => typeof arg === "function");
            if (callback > -1) {
               return provider.methods[methodName](state, ...args.slice(0, callback), args[callback].bind(this));
            }
            return provider.methods[methodName](state, ...args);
         };
         return acc;
      },
      {} as { [key: string]: Function }
   );

   return {
      state: typeof state,
      ...methods
   };
};

// getProvider("globalProvider")
export const getProvider = (provider: string) => {
   return inject(provider);
};

// getFileExtension(blob) => "jpg"
export const getFileExtension = (blob: any): string => {
   return blob.type || blob.type.split["/"][1];
};

// upperCase("hello world") => "HELLO WORLD"
export const upperCase = (value: any, locale: string = getUserLocale()): string => {
   return value.toLocaleUpperCase(locale);
};

// lowerCase("HELLO WORLD") => "hello world"
export const lowerCase = (value: any, locale: string = getUserLocale()): string => {
   return value.toLocaleLowerCase(locale);
};

// ucWords("hello world") => "Hello World"
export const ucWords = (value: any): string => {
   return lowerCase(value).replace(/(^\p{L})|(\s+\p{L})/gu, (char) => {
      return upperCase(char);
   });
};

// ucFirst("hello world") => "Hello world"
export const ucFirst = (value: any): string => {
   return upperCase(value.charAt(0)) + lowerCase(value.slice(1));
};

// escape url
export const escapeUrl = (url: any): string => {
   url = url.replace(/\\/g, "/");
   return encodeURI(url);
};

// drag hide
export const dragHide = (e: any): void => {
   let crt = e.target.cloneNode(true);
   crt.style.display = "none";
   e.dataTransfer.setDragImage(crt, 0, 0);
};

// position
export const position = {
   offset: function (node: HTMLElement, view = true) {
      let rect: any = node.getBoundingClientRect();
      let owner: any = node.ownerDocument.defaultView;

      return {
         top: view === false ? node.offsetTop : Math.round(rect.top + owner.pageYOffset),
         left: view === false ? node.offsetLeft : Math.round(rect.left + owner.pageXOffset),
         width: node.offsetWidth,
         height: node.offsetHeight
      };
   },

   client: function (node: HTMLElement) {
      return {
         top: node.clientTop,
         left: node.clientLeft,
         width: node.clientWidth,
         height: node.clientHeight
      };
   },

   scroll: function (node: HTMLElement) {
      let win: any = window;
      let doc: any = document.documentElement;

      return {
         top: node === win ? (win.scrollY || doc.scrollTop) - (doc.clientTop || 0) || win.scrollY : node.scrollTop,
         left: node === win ? (win.scrollX || doc.scrollLeft) - (doc.clientLeft || 0) || win.scrollX : node.scrollLeft,
         width: node.scrollWidth,
         height: node.scrollHeight
      };
   },

   rect: function (node: HTMLElement) {
      let rect = node.getBoundingClientRect();
      let ie = navigator.userAgent.indexOf("MSIE") !== -1;
      let top = ie && node.tagName === "HTML" ? -node.scrollTop : rect.top;

      return {
         x: Math.round(rect.x),
         y: Math.round(rect.y),
         top: Math.round(top),
         right: Math.round(rect.right),
         bottom: Math.round(rect.bottom),
         left: Math.round(rect.left),
         width: Math.round(rect.width),
         height: Math.round(rect.height)
      };
   }
};
