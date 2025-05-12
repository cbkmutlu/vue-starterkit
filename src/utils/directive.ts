import { DirectiveBinding, createVNode, render } from "vue";
import { VTooltip } from "vuetify/components";

export const registerDirectives = (app: App) => {
   let tooltips: { el: HTMLElement }[] = [];

   app.directive("directive-focus", {
      mounted: (el: HTMLElement) => el.focus()
   });

   app.directive("directive-tooltip", {
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
