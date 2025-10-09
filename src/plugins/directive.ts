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

   app.directive("tooltip", {
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
