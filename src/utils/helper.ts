import type { I18n } from "vue-i18n";
import type { ThemeInstance } from "vuetify";

/**
 * Verilen dosya yolunu `VITE_MEDIA` ile birleştirir.
 * @example
 * getMedia("image.png") => "http://localhost:3000/image.png"
 */
export const getMedia = (path: string | undefined): string => {
   if (typeof path !== "string") {
      errorLog("[getMedia] path is not string");
   }
   return import.meta.env.VITE_MEDIA + "/" + path;
};

/**
 * Geliştirme ortamında hata mesajı gösterir.
 * @example
 * errorLog("Hello World") => "Hello World"
 */
export const errorLog = (message: any, ...optionalParams: any[]) => {
   if (process.env.NODE_ENV === "development") {
      console.error(message, ...optionalParams);
   }
};

/**
 * Kullanıcının reduksiyon tercihini kontrol eder.
 * @example
 * getMotionReduction() => true
 */
export const getMotionReduction = () => {
   return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Kullanıcının tercih ettiği temayı değiştirir ve `localStorage[appConfig.key.theme]` anahtarına kaydeder.
 * @example
 * setTheme("dark") => Tema dark olarak değişir.
 */
export const setTheme = (theme: ThemeInstance, value: "light" | "dark" | "system"): void => {
   theme.change(value);
   localStorage.setItem(appConfig.key.theme, value);
};

/**
 * Kullanıcının tercih ettiği temayı değiştirir ve `localStorage[appConfig.key.theme]` anahtarına kaydeder.
 * @example
 * toggleTheme() => Mevcut tema light ise dark, dark ise system, system ise light olarak değişir.
 */
export const toggleTheme = (theme: ThemeInstance): void => {
   const current = getTheme();
   let next: any;
   if (current === "light") {
      next = "dark";
   } else if (current === "dark") {
      next = "system";
   } else {
      next = "light";
   }

   setTheme(theme, next);
};

/**
 * Kullanıcının tercih ettiği temayı `localStorage[appConfig.key.theme]` anahtarından alır.
 * Değer `light` veya `dark` değilse varsayılan olarak `system` döndürür.
 */
export const getTheme = (): string => {
   const theme = localStorage.getItem(appConfig.key.theme);

   if (theme && ["light", "dark"].includes(theme)) {
      return theme;
   }

   return "system";
};

/**
 * Kullanıcının tercih ettiği dili değiştirir ve `localStorage[appConfig.key.locale]` anahtarına kaydeder.
 * @example
 * setLocale("tr-TR") => Dil Türkçe olarak değişir.
 */
export const setLocale = (i18n: I18n, locale: string, message: Record<string, string>): void => {
   document.documentElement.setAttribute("lang", locale);
   localStorage.setItem(appConfig.key.locale, locale);

   if (Object.keys(message).length) {
      i18n.global.setLocaleMessage(locale, message);
   }

   if (isRef(i18n.global.locale)) {
      i18n.global.locale.value = locale;
   } else {
      i18n.global.locale = locale;
   }
};

/**
 * Kullanıcının tercih ettiği dili `localStorage[appConfig.key.locale]` anahtarından alır.
 * Değer `appConfig.language.locales` listesinde yoksa varsayılan olarak `appConfig.language.default` değerini döndürür.
 * @example
 * getLocale() => "tr-TR"
 */
export const getLocale = (): string => {
   const locale = localStorage.getItem(appConfig.key.locale);

   if (locale && Object.keys(appConfig.language.locales).includes(locale)) {
      return locale;
   }

   return appConfig.language.default;
};

const cache_locale: string[] = [];
/**
 * Verilen değere ait dil dosyalarını yükler. Yüklenen dosyalar ön belleğe alınır ve tekrar yüklenmez.
 * @example
 * loadLocale("tr-TR") => Dil dosyaları yüklenir.
 */
export const loadLocale = async (locale: string): Promise<Record<string, any>> => {
   if (cache_locale.includes(locale)) {
      return {};
   }

   const commonPromise = import(`@/locales/${locale}.json`)
      .then((mod) => mod.default)
      .catch(() => {
         errorLog(`[loadLocale] ${locale} not found`);
         return {};
      });

   const modulePromise = appConfig.module.map(async (module: string) => {
      return import(`@/modules/${module}/locales/${locale}.json`)
         .then((mod) => mod.default)
         .catch(() => {
            errorLog(`[loadLocale] ${module} module locales not found`);
            return {};
         });
   });

   const [common, ...modules] = await Promise.all([commonPromise, ...modulePromise]);
   cache_locale.push(locale);

   return {
      ...common,
      ...Object.assign({}, ...modules),
      $vuetify: appConfig.language.locales[locale as keyof typeof appConfig.language.locales]?.vuetify
   };
};

/**
 * Modüllerdeki route dosyalarını yükler.
 * @example
 * loadRoute() => Route dosyaları yüklenir.
 */
export const loadRoute = async (): Promise<RouteRecordRaw[]> => {
   const commonPromise = import("@/utils/routes.ts")
      .then((mod) => {
         return Object.values(mod)
            .filter((res) => Array.isArray(res))
            .flat();
      })
      .catch(() => {
         errorLog("[loadRoute] routes not found");
         return [];
      });

   const modulePromise = appConfig.module.map((module: string) =>
      import(`@/modules/${module}/utils/routes.ts`)
         .then((mod) => {
            return Object.values(mod)
               .filter((res) => Array.isArray(res))
               .flat();
         })
         .catch(() => {
            errorLog(`[loadRoute] ${module} module routes not found`);
            return [];
         })
   );

   const [common, ...modules] = await Promise.all([commonPromise, ...modulePromise]);
   return [...common, ...modules.flat()];
};

/**
 * Modüllerdeki menü dosyalarını yükler.
 * @example
 * loadMenu() => Menü dosyaları yüklenir.
 */
export const loadMenu = async (): Promise<Record<string, TList[]>> => {
   const commonPromise = import("@/utils/menu.ts")
      .then((mod) => {
         return {
            default: Object.values(mod)
               .filter((res) => Array.isArray(res))
               .flat()
         };
      })
      .catch(() => {
         errorLog("[loadMenu] menu not found");
         return { default: [] };
      });

   const modulePromise = appConfig.module.map((module: string) =>
      import(`@/modules/${module}/utils/menu.ts`)
         .then((mod) => {
            return {
               [module.toLowerCase()]: Object.values(mod)
                  .filter((res) => Array.isArray(res))
                  .flat()
            };
         })
         .catch(() => {
            errorLog(`[loadMenu] ${module} module menu not found`);
            return { [module.toLowerCase()]: [] };
         })
   );

   const [common, ...modules] = await Promise.all([commonPromise, ...modulePromise]);
   return {
      ...common,
      ...Object.assign({}, ...modules)
   };
};

/**
 * Verilen değeri slug formatına çevirir.
 * @example
 * createSlug("Merhaba Dünya") => "merhaba-dunya"
 * createSlug("Straße Köln", "de-DE") => "strasse-koeln"
 * createSlug("œuf æther", "fr-FR") => "oeuf-aether"
 * createSlug("København & Århus", "da-DK") => "kobenhavn-og-arhus"
 */
export const createSlug = (input: any, locale: string = getLocale()): string => {
   if (!input) {
      return "";
   }

   const locales: Record<string, Record<string, string>> = {
      "de-DE": { ä: "ae", ö: "oe", ü: "ue" },
      "fr-FR": { œ: "oe", æ: "ae" },
      "da-DK": { ø: "o", æ: "ae", å: "a" },
      "tr-TR": { ı: "i", ß: "b", "&": "-ve-" },
      fallback: { œ: "oe", æ: "ae", ß: "ss", ø: "o", ı: "i", "&": "-and-" }
   };
   const chars = Object.assign({}, locales[locale] || {}, locales["fallback"] || {});

   return String(input)
      .normalize("NFD")
      .toLocaleLowerCase(locale)
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/./g, (ch: string) => chars[ch] ?? ch)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
};

/**
 * Verilen formatı belirtilen argümanlarla doldurur.
 * @example
 * replaceString("Merhaba {0}, selamlar", ["dünya"]) => "Merhaba dünya, selamlar"
 * replaceString("Merhaba {0,1} {1}", [["dünya", "venus"], ["selamlar"]]) => "Merhaba venus selamlar"
 * replaceString("Merhaba {0,0} {1}", [["dünya", "venus"], ["selamlar"]]) => "Merhaba dünya selamlar"
 */
export const replaceString = (format: string, args: any[]): string => {
   return format.replace(/{(\d+)(?:,(\d+))?}/g, (match, index, sub) => {
      let value = args[index];

      if (typeof sub !== "undefined" && Array.isArray(value)) {
         value = value[sub];
      }

      return typeof value !== "undefined" ? value : match;
   });
};

/**
 * Verilen değeri `regex` formatına çevirir ve verilen verilerde arama yapar.
 * @example
 * searchString("hello", "hello world") => true
 */
export const searchString = (items: string, query: string, locale: string = getLocale()) => {
   if (!query || !items) {
      return false;
   }

   const locales: Record<string, string[]> = {
      "tr-TR": ["üÜuU", "ğĞgG", "şŞsS", "çÇcC", "öÖoO"],
      fallback: ["iİıI", "üÜuU", "ğĞgG", "şŞsS", "çÇcC", "öÖoO"]
   };

   // const chars = locales[locale] || locales["fallback"] || [];
   const chars = [...new Set([...(locales[locale] || []), ...(locales.fallback || [])])];
   query = lowerCase(query)
      .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
      .replace(/[\*\s]/g, ".*");

   for (const char of chars) {
      const regex = new RegExp(`[${char}]`, "g");
      query = query.replace(regex, `[${char}]`);
   }

   const filter = new RegExp(query, "i");
   return items.search(filter) !== -1;
};

const cache_number: Record<string, { group: string; decimal: string }> = {};
/**
 * Verilen dil için grup ve ondalık ayraç karakterlerini döndürür.
 * @example
 * decimalSeparator("tr-TR") => { group: ".", decimal: "," }
 */
export const decimalSeparator = (locale: string) => {
   if (!cache_number[locale]) {
      const sample = 123456.7;
      const format = new Intl.NumberFormat(locale).format(sample);

      const group = format.match(/(\D+)/)?.[0] ?? ",";
      const decimal = format.match(/(\D+)(\d+)$/)?.[1] ?? ".";

      cache_number[locale] = { group, decimal };
   }
   return cache_number[locale];
};

/**
 * Verilen para birimi için dilde kullanılan sembolü döndürür.
 * @example
 * currencySymbol("TRY") => "₺"
 */
export const currencySymbol = (currency: string = "TRY", locale: string = getLocale()): string => {
   const format = new Intl.NumberFormat(locale, { style: "currency", currency, currencyDisplay: "narrowSymbol" });
   const parts = format.formatToParts(0);
   const symbol = parts.find((p) => p.type === "currency");

   return symbol?.value ?? currency;
};

/**
 * Verilen telefon numarasını formatlar.
 * @example
 * formatPhone("05321234567") => "0532 123 4567"
 */
export const formatPhone = (value: string) => {
   return value.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3");
};

/**
 * Verilen değeri Türkiye para yazım formatına çevirir.
 * @example
 * formatNumber(0)       => "0,00"
 * formatNumber(2155)    => "2.155,00"
 * formatNumber(2155.00) => "2.155,00"
 */
export const formatNumber = (value: number | undefined, min: number = 2, max: number = 2, locale: string = getLocale()): string => {
   if (value === undefined) {
      value = 0;
   }

   if (isNaN(value)) {
      value = 0;
   }

   return value.toLocaleString(locale, { minimumFractionDigits: min, maximumFractionDigits: max });
};

/**
 * Verilen değeri sayıya çevirir.
 *
 * @example
 * parseNumber("")         => 0
 * parseNumber("2.155,00") => 2155
 * parseNumber("2.155,10") => 2155.1
 */
export const parseNumber = (value: string, locale: string = getLocale()): number => {
   if (!cache_number[locale]) {
      cache_number[locale] = decimalSeparator(locale);
   }

   const { group, decimal } = cache_number[locale];
   if (!value) {
      return 0;
   }

   const parse = value
      .replace(new RegExp(`\\${group}`, "g"), "")
      .replace(new RegExp(`\\${decimal}`), ".")
      .replace(/\p{Nd}/gu, (char) => {
         const code = char.codePointAt(0)!;
         if (code >= 48 && code <= 57) {
            return char;
         }
         return String.fromCharCode("0".charCodeAt(0) + (code % 10));
      });

   const result = Number(parse);
   return isNaN(result) ? 0 : result;
};

/**
 * Basamakların solunu sıfırlarla doldurur. Varsayılan basamak sayısı `2`'dir.
 * @example
 * prefixNumber(-1)   => "-01"
 * prefixNumber(9)    => "09"
 * prefixNumber(9, 3) => "009"
 */
export const prefixNumber = (value: number, pad: number = 2): string => {
   if (isNaN(value)) {
      value = 0;
   }

   const result = String(Math.abs(value)).padStart(pad, "0");
   return value < 0 ? "-" + result : result;
};

/**
 * Basamakların sağını sıfırlarla doldurur. Varsayılan basamak sayısı `2`'dir.
 * @example
 * suffixNumber("")         => "0,00"
 * suffixNumber("2.155")    => "2.155,00"
 * suffixNumber("2.155,1")  => "2.155,10"
 */
export const suffixNumber = (value: string, pad: number = 2, locale: string = getLocale()): string => {
   if (!cache_number[locale]) {
      cache_number[locale] = decimalSeparator(locale);
   }

   const { decimal } = cache_number[locale];
   if (!value) {
      return `0${decimal}00`;
   }

   const [integer, fraction = ""] = value.split(decimal);
   return `${integer}${decimal}${fraction.padEnd(pad, "0")}`;
};

/**
 * Verilen değeri kısaltarak basamak sayısını azaltır.
 * @example
 * formatCounter(1000)    => 1k
 * formatCounter(100000)  => 100k
 * formatCounter(1000000) => 1m
 */
export const formatCounter = (num: number): string => {
   if (isNaN(num)) {
      num = 0;
   }

   if (num < 1000) {
      return num.toString();
   }

   const units = ["k", "m", "b", "t"];
   const exp = Math.floor(Math.log(num) / Math.log(1000));

   return num / Math.pow(1000, exp) + units[exp - 1];
};

/**
 * Verilen değeri dosya boyutu birimlerine çevirir.
 * @example
 * formatSize(1024)               => 1KB
 * formatSize(1024 * 1024)        => 1MB
 * formatSize(1024 * 1024 * 1024) => 1GB
 */
export const formatSize = (bytes: number): string => {
   if (isNaN(bytes)) {
      bytes = 0;
   }

   const units = ["B", "KB", "MB", "GB", "TB", "PB"];
   const exp = Math.floor(Math.log(bytes) / Math.log(1024));

   return parseFloat((bytes / Math.pow(1024, exp)).toFixed(3)) + units[exp];
};

/**
 * Verilen değeri belirtilen format ve dil seçeneklerine göre çevirir.
 * @example
 * formatDate(new Date()) => "25.04.1986" (Günün tarihi)
 * formatDate(new Date(),{ dateStyle: "full" }) => "Friday, Apr 25, 2025"
 * @link
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 */
export const formatDate = (date: Date | string, options: Intl.DateTimeFormatOptions = {}, locale: string = getLocale()): string | null => {
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

/**
 * Verilen tarihin saat, dakika, saniye ve milisaniye değeri aynı anda `0` ise saati `23`, dakikayı `59`, saniyeyi `59` ve milisaniyeyi `999` yapar.
 * Tümü `0` olduğunda veritabanı tarih karşılaştırmasında sorun çıkabiliyor.
 * @example
 * endOfDay(new Date()) => 1986-04-25 23:59:59:999 (00:00:00:000 => 23:59:59:999)
 */
export const endOfDay = (value: Date | string): Date => {
   const date = new Date(value);
   if (date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0 && date.getMilliseconds() === 0) {
      date.setHours(23);
      date.setMinutes(59);
      date.setSeconds(59);
      date.setMilliseconds(999);
   }

   return date;
};

/**
 * Verilen nesnenin reaktif değerlerini alır.
 * @example
 * deepValue({ a: 1, b: ref(2), c: { d: 3, e: ref(4) } }) => { a: 1, b: 2, c: { d: 3, e: 4 } }
 */
export const deepValue = <T>(source: T): T => {
   const traverse = (input: any): any => {
      if (input instanceof Date) {
         return input;
      }
      if (Array.isArray(input)) {
         return input.map(traverse);
      }
      if (isRef(input)) {
         return traverse(input.value);
      }
      if (isReactive(input)) {
         return traverse(toRaw(input));
      }
      if (input && typeof input === "object") {
         return Object.keys(input).reduce((acc, key) => {
            acc[key as keyof typeof acc] = traverse(input[key]);
            return acc;
         }, {} as T);
      }
      return input;
   };

   return traverse(source);
};

/**
 * Zaman damgalı rastgele bir `GUID` üretir. Zaten üretilmiş olan `GUID`'lerin tekrar üretilmemesi için `haystack`
 * parametresi ile mevcut `GUID`'lerin listesini de gönderebilirsiniz.
 * @example
 * generateRandomGuid() => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
 */
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

/**
 * Rastgele bir dize üretir.
 * @example
 * generateRandomString() => "aBcDeFgHiJ"
 * generateRandomString(8, { upperCase: false, lowerCase: true, numbers: false }) => "abcdefgh"
 */
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

/**
 * İşlemler belirtilen süre içinde tekrar çağrılırsa önceki çağrıyı iptal eder ve yeni bir çağrı başlatır.
 * @example
 * debounceTimer(() => console.log("debounce"), 350)
 * @link
 * https://css-tricks.com/debouncing-throttling-explained-examples/
 */
export const debounceTimer = (callback: (...args: any[]) => void, delay: number = 350, instant: any = true): Function => {
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

/**
 * İşlemler belirtilen süre içinde tekrar çağrılırsa önceki çağrıyı iptal etmez ve belirtilen süre içinde sadece bir kez çalışır.
 * @example
 * throttleTimer(() => console.log("throttle"), 350)
 * @link
 * https://css-tricks.com/debouncing-throttling-explained-examples/
 */
export const throttleTimer = (callback: any, delay: number, instant: any = true): object => {
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

/**
 * Tekrar deneme süresini hesaplar.
 * @example
 * attemptDelay(0) => 1000
 * attemptDelay(1) => 2000
 * attemptDelay(2) => 4000
 * attemptDelay(3) => 8000
 * attemptDelay(4) => 10000 (max)
 */
export const attemptDelay = (attempt: number, max: number = 30000) => {
   if (appConfig.retry.gradual) {
      return Math.min(appConfig.retry.delay * 2 ** attempt, max);
   } else {
      return appConfig.retry.delay;
   }
};

/**
 * Belirtilen süre kadar bekler.
 * @example
 * sleepDelay(1000) => 1000ms sonra resolve eder.
 */
export const sleepDelay = (delay: number = 500): Promise<void> => {
   return new Promise((resolve) => (delay ? setTimeout(resolve, delay) : resolve()));
};

/**
 * Form verilerini `FormData` nesnesine çevirir.
 * @example
 * createFormData({ name: "John", age: 30, email: "john@example.com" })
 * createFormData({ name: "John", age: 30, email: "john@example.com" }, { files: [file1, file2] })
 */
export const createFormData = <T extends Record<string, any>>(form: T, additional: Record<string, any> = {}): FormData => {
   const formData = new FormData();

   const appendValue = (formData: FormData, key: string, value: any) => {
      if (!value) {
         return;
      }

      if (Array.isArray(value)) {
         if (value.length === 0) {
            return;
         }

         if (value.every((item) => item instanceof File)) {
            value.forEach((file: File) => formData.append(`${key}[]`, file));
         } else if (value.every((item) => typeof item === "object")) {
            formData.append(key, JSON.stringify(value));
         } else {
            value.forEach((item) => formData.append(`${key}[]`, String(item)));
         }
      } else if (value instanceof File || value instanceof Blob) {
         formData.append(key, value);
      } else if (value instanceof Date) {
         formData.append(key, value.toISOString());
      } else if (typeof value === "object") {
         formData.append(key, JSON.stringify(value));
      } else {
         formData.append(key, String(value));
      }
   };

   for (const key in form) {
      appendValue(formData, key, form[key]);
   }

   for (const key in additional) {
      appendValue(formData, key, additional[key]);
   }

   return formData;
};

/**
 * Verilen verilerden varsayılan değerleri veya belirtilen değeri alır.
 * @example
 * setInitialData([{ id: 1, name: "John", default: "John" }, { id: 2, name: "Doe", default: "Doe" }], "name", "Doe")
 */
export const setInitialData = (items: any, key: string, value: any) => {
   const initialData: { [key: string]: any } = {};
   items.forEach((item: any) => (initialData[item[key]] = item.default || value));
   return initialData;
};

/**
 * Provider oluşturma
 * @link
 * https://vuejsdevelopers.com/2020/10/05/composition-api-vuex/
 */
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

/**
 * Provider okuma
 */
export const getProvider = (provider: string) => {
   return inject(provider);
};

/**
 * Component loader
 */
export const getComponent = (promise: () => Promise<Component>): (() => Promise<Component>) => {
   return async () => {
      const appStore = useAppStore();

      appStore.setComponentLoading(true);
      return await promise()
         .then((mod) => mod)
         .finally(() => {
            appStore.setComponentLoading(false);
         });
   };
};

/**
 * Component loader
 */
export const getComponentAsync = (component: string, error: Component): Component => {
   const appStore = useAppStore();

   return defineAsyncComponent({
      loader: async () => {
         return await import(`@/components/layouts/${component}/Layout.vue`).then((mod) => {
            appStore.setLayoutLoading(false);
            return mod.default;
         });
      },
      onError(error, retry, fail, attempts) {
         const retryDelay = attemptDelay(attempts - 1);

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

/**
 * Google Translate API'sini kullanarak verilen metni çevirir.
 * @example
 * useGoogleTranslate().translate("Merhaba dünya", "tr", "en") => "Hello world"
 */
export function useGoogleTranslate() {
   const isLoading = ref(false);
   const isError = ref(false);
   const data = ref<string | null>("");

   const translate = async (text: string, from = "tr", to = "en"): Promise<any> => {
      isLoading.value = true;
      isError.value = false;
      data.value = "";

      try {
         const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`);
         const json = await response.json();
         for (const item of json[0]) {
            data.value += item[0];
         }
         return data.value;
      } catch {
         isError.value = true;
         data.value = text;
         return text;
      } finally {
         isLoading.value = false;
      }
   };

   return {
      translate,
      isLoading: computed(() => isLoading.value),
      isError: computed(() => isError.value),
      data: computed(() => data.value)
   };
}

/**
 * Route parametrelerini okur.
 * @example
 * useParam("id") => "1"
 * useParam("id", true) => "1"
 * useParam("id", false) => ["1", "2", "3"]
 */
export function useParam(param: string, useFirstIfArray = true): Ref<string | string[]> {
   const route = useRoute();

   return computed(() => {
      let paramValue = route.params[param as keyof typeof route.params];

      if (useFirstIfArray && Array.isArray(paramValue) && paramValue.length) {
         [paramValue] = paramValue;
      }

      return paramValue;
   }) as any;
}

/**
 * Tanstack Query wrapper
 * @link
 * https://tanstack.com/query/latest/docs/framework/vue/reference/useQuery
 */
export const useQueryWrapper = <T>(options: UseQueryOptions<T>, payload?: TQuery<T>) => {
   const query = <UseQueryReturnType<T, Error>>useQuery<T>(toValue(options));
   const isFirst = ref(true);

   watch(
      () => query.data.value,
      () => {
         if (query.isSuccess.value && query.data.value) {
            isFirst.value = false;
            payload?.onSuccess?.(query.data.value);
         }
      },
      { immediate: true }
   );

   watch(
      () => query.isError.value,
      () => {
         if (query.isError.value && query.error.value) {
            payload?.onError?.(query.error.value);
         }
      },
      { immediate: true }
   );

   // ALTER
   // const isLoading = computed(() => query.isLoading.value);

   return {
      ...query,
      // isLoading: query.isLoading,
      isFirst
   };
};

/**
 * Tanstack Query data
 */
export const queryData = (key: any): { [key: string]: any } => {
   const queryClient = useQueryClient();
   return queryClient.getQueryData([key]) || [];
};

/**
 * Tanstack Query prefetch
 */
export const queryPrefetch = async (key: string, callback: Function) => {
   const queryClient = useQueryClient();
   await queryClient.prefetchQuery({
      queryKey: [key],
      queryFn: callback.call(this)
   });
};

/**
 * Dosya bilgilerini döndürür.
 * @example
 * fileInfo(blob) => "jpg"
 */
export function fileInfo(blob: Blob | File) {
   const isFile = blob instanceof File;
   const name = isFile ? blob.name : null;
   const type = blob.type || null;
   const size = blob.size;
   let extension;

   if (isFile) {
      const parts = blob.name.split(".");
      extension = parts.length > 1 ? parts.pop()!.toLowerCase() : "";
   } else if (type) {
      const parts = type.split("/");
      extension = parts.length > 1 ? parts[1].toLowerCase() : "";
   }

   return { name, extension, type, size, isFile };
}

/**
 * Büyük harfe çevirir.
 * @example
 * upperCase("hello world") => "HELLO WORLD"
 */
export const upperCase = (value: any, locale: string = getLocale()): string => {
   return value.toLocaleUpperCase(locale);
};

/**
 * Küçük harfe çevirir.
 * @example
 * lowerCase("HELLO WORLD") => "hello world"
 */
export const lowerCase = (value: any, locale: string = getLocale()): string => {
   return value.toLocaleLowerCase(locale);
};

/**
 * Her kelimenin ilk harfini büyük harfe çevirir.
 * @example
 * ucWords("hello world") => "Hello World"
 */
export const ucWords = (value: any): string => {
   return lowerCase(value).replace(/(^\p{L})|(\s+\p{L})/gu, (char) => {
      return upperCase(char);
   });
};

/**
 * İlk harfi büyük harfe çevirir.
 * @example
 * ucFirst("hello world") => "Hello world"
 */
export const ucFirst = (value: any): string => {
   return upperCase(value.charAt(0)) + lowerCase(value.slice(1));
};

/**
 * Bir dosya yolu veya URL ifadesini güvenli ve geçerli bir URL biçimine dönüştürür.
 * URL'deki ters eğik çizgileri düz eğik çizgiye çevirir ve URL'i kodlar.
 * @example
 * escapeUrl("hello\\world") => "hello/world"
 * escapeUrl("hello/world")  => "hello/world"
 * escapeUrl("hello world")  => "hello%20world"
 */
export const escapeUrl = (url: any): string => {
   url = url.replace(/\\/g, "/");
   return encodeURI(url);
};

/**
 * Sürükle bırak işlemi sırasında elementin görünümünü gizler.
 * @example
 * dragHide(event)
 */
export const dragHide = (e: any): void => {
   let crt = e.target.cloneNode(true);
   crt.style.display = "none";
   e.dataTransfer.setDragImage(crt, 0, 0);
};

/**
 * Elemanın konumunu döndürür.
 * @example
 * position.offset(node) => { top: 0, left: 0, width: 0, height: 0 }
 * position.client(node) => { top: 0, left: 0, width: 0, height: 0 }
 * position.scroll(node) => { top: 0, left: 0, width: 0, height: 0 }
 * position.rect(node)   => { x: 0, y: 0, top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }
 */
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
