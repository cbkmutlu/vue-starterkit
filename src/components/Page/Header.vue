<template>
   <div>
      <div
         v-if="$slots.prepend || $slots.append"
         class="flex items-end justify-between gap-2 leading-9 last:pb-4 text-xl">
         <slot name="prepend" />
         <v-spacer />
         <slot name="append" />
      </div>

      <div
         v-if="$slots.extend"
         class="flex py-4">
         <slot name="extend" />
      </div>
   </div>
</template>
