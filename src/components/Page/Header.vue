<template>
   <div>
      <div
         v-if="$slots.prepend || $slots.append"
         class="flex justify-between gap-2 leading-9 last:pb-3">
         <slot name="prepend" />
         <v-spacer />
         <slot name="append" />
      </div>

      <div
         v-if="$slots.extend"
         class="flex py-3">
         <slot name="extend" />
      </div>
   </div>
</template>
