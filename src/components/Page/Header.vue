<template>
   <v-card-item
      v-if="$slots.title || $slots.subtitle || $slots.append"
      class="mb-2 min-h-11 p-0">
      <v-card-title
         v-if="$slots.title"
         class="text-base">
         <slot name="title" />
      </v-card-title>

      <v-card-subtitle
         v-if="$slots.subtitle"
         class="p-0 text-sm">
         <slot name="subtitle" />
      </v-card-subtitle>

      <template
         v-if="$slots.append"
         v-slot:append>
         <div class="flex-center gap-2">
            <slot name="append" />
         </div>
      </template>
   </v-card-item>

   <slot />
</template>
