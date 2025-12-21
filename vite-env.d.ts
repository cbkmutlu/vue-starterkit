/// <reference types="vite/client" />

interface ImportMeta {
   readonly env: {
      readonly VITE_PORT;
      readonly VITE_BASE;
      readonly VITE_API;
      readonly VITE_MEDIA;
   };
}
