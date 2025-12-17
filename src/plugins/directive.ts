import { vMaska } from "maska/vue";
import type { App } from "vue";
import { DirectiveBinding, createVNode, render } from "vue";
import { VTooltip } from "vuetify/components";

export const registerDirective = (app: App) => {
   let tooltips: { el: HTMLElement }[] = [];

   app.directive("uppercase", {
      mounted: (el: HTMLElement, _, vnode: any) => {
         el.addEventListener("input", (e: any) => {
            vnode.ctx?.emit("update:modelValue", upperCase((e.target as HTMLInputElement).value));
         });
      }
   });

   app.directive("lowercase", {
      mounted: (el: HTMLElement, _, vnode: any) => {
         el.addEventListener("input", (e: any) => {
            vnode.ctx?.emit("update:modelValue", lowerCase((e.target as HTMLInputElement).value));
         });
      }
   });

   app.directive("ucfirst", {
      mounted: (el: HTMLElement, _, vnode: any) => {
         el.addEventListener("input", (e: any) => {
            vnode.ctx?.emit("update:modelValue", ucFirst((e.target as HTMLInputElement).value));
         });
      }
   });

   app.directive("ucwords", {
      mounted: (el: HTMLElement, _, vnode: any) => {
         el.addEventListener("input", (e: any) => {
            vnode.ctx?.emit("update:modelValue", ucWords((e.target as HTMLInputElement).value));
         });
      }
   });

   app.directive("focus", {
      mounted: (el: HTMLElement) => el.focus()
   });

   app.directive("maska", vMaska);

   // v-press:'{"delay":700,"interval":200}'="handlerFunction"
   // v-press="handlerFunction"
   app.directive("press", {
      mounted(el: HTMLElement, binding: DirectiveBinding) {
         if (typeof binding.value !== "function") {
            console.warn("[v-press] value must be a function");
            return;
         }

         let pressTimer: any = null;
         let repeatTimer: any = null;
         const delay = binding.arg?.delay ?? 500;
         const interval = binding.arg?.interval ?? 100;

         const handler = (e: any) => binding.value(e);
         const start = (e: any) => {
            if (e.type === "click" && e.button !== 0) return;
            cancel();

            pressTimer = setTimeout(() => {
               handler(e);
               repeatTimer = setInterval(() => handler(e), interval);
            }, delay);
         };

         const cancel = () => {
            if (pressTimer) {
               clearTimeout(pressTimer);
               pressTimer = null;
            }
            if (repeatTimer) {
               clearInterval(repeatTimer);
               repeatTimer = null;
            }
         };

         el.addEventListener("pointerdown", start);
         el.addEventListener("pointerup", cancel);
         el.addEventListener("pointercancel", cancel);
         el.addEventListener("pointerleave", cancel);
         el.addEventListener("click", handler);
      },

      unmounted(el: HTMLElement) {
         el.removeEventListener("pointerdown", () => {});
         el.removeEventListener("pointerup", () => {});
         el.removeEventListener("pointercancel", () => {});
         el.removeEventListener("pointerleave", () => {});
         el.removeEventListener("click", () => {});
      }
   });

   app.directive("tooltip-custom", {
      beforeUnmount: (el: HTMLElement) => {
         const tooltipIndex = tooltips.findIndex((tooltip) => tooltip.el === el);
         const tooltip = tooltips.splice(tooltipIndex, 1);
         if (tooltip.length > 0) {
            render(null, el);
         }
      },
      mounted: (el: HTMLElement, binding: DirectiveBinding) => {
         const { value, modifiers } = binding;
         const { start = false, bottom = false, end = false } = modifiers;

         let location;
         if (start) {
            location = "left";
         } else if (end) {
            location = "right";
         } else if (bottom) {
            location = "bottom";
         } else {
            location = "top";
         }

         if (!el.className.match(/cursor-/) && !el.style.cursor) {
            el.style.cursor = "help";
         }

         let vNode = createVNode(
            VTooltip,
            {
               activator: el,
               location
            },
            () => [value]
         );

         vNode.appContext = app._context;
         render(vNode, el);
         tooltips.push({ el });
      }
   });
};
