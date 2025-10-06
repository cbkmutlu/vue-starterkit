<template>
   <v-menu
      v-model="menu"
      v-bind:close-on-content-click="false"
      v-bind:offset="props.hideDetails ? [0, 0] : [-22, 0]"
      class="[&_.v-overlay\_\_content]:!min-w-min"
      eager
      transition="fade-transition">
      <template v-slot:activator="{ props: activatorProps }">
         <v-text-field
            v-bind="{ ...activatorProps, ...$attrs }"
            v-bind:active="menu"
            v-bind:hide-details="props.hideDetails"
            v-bind:model-value="display"
            v-bind:readonly="props.readonly"
            v-bind:title="props.title"
            @click:clear="menu = !!props.openOnClear"
            @update:model-value="model = null!" />
      </template>

      <v-card class="overflow-x-hidden">
         <div class="year-content:grid-cols-2 flex [&_.v-picker\_\_body]:flex-col">
            <slot
               v-bind:date-handler="dateHandler"
               name="prepend" />
            <v-divider
               v-if="$slots.prepend"
               vertical />
            <div>
               <v-card-title
                  v-if="props.title || $slots.title"
                  class="pb-0 text-base">
                  <slot
                     v-bind:model
                     name="title">
                     <template v-if="props.title === true">
                        {{ date.format(model, props.format) || t("app.noDate") }}
                     </template>

                     <template v-else-if="props.title">
                        {{ props.title }}
                     </template>
                  </slot>
               </v-card-title>
               <v-date-picker
                  v-model="model"
                  v-bind="{ ...$attrs }"
                  v-bind:first-day-of-week="props.firstDayOfWeek"
                  v-bind:show-adjacent-months="props.showAdjacentMonths"
                  class="button-default:text-xs button-default:font-normal button-month:min-w-32 w-auto"
                  color="primary"
                  hide-header
                  @update:model-value="dateHandler($event)">
                  <template
                     v-if="props.actions"
                     v-slot:actions>
                     <v-btn
                        color="error"
                        rounded
                        size="small"
                        variant="tonal"
                        @click="menu = false">
                        {{ t("app.cancel") }}
                     </v-btn>

                     <v-spacer></v-spacer>

                     <v-btn
                        rounded
                        size="small"
                        variant="text"
                        @click="dateHandler(new Date(), 0)">
                        {{ t("app.today") }}
                     </v-btn>

                     <v-btn
                        rounded
                        size="small"
                        variant="text"
                        @click="dateHandler(new Date(), 1)">
                        {{ t("app.tomorrow") }}
                     </v-btn>
                  </template>
               </v-date-picker>
            </div>
         </div>
      </v-card>
   </v-menu>
</template>

<script lang="ts" setup>
import type { TDateField } from "@/utils/vuetify";

type TProps = {
   title?: boolean | string;
   readonly?: boolean;
   actions?: boolean;
   hideDetails?: boolean;
   firstDayOfWeek?: number;
   showAdjacentMonths?: boolean;
   closeOnPickerClick?: boolean;
   openOnClear?: boolean;
   color?: string;
   endOfDay?: boolean;
   /**
    * https://vuetifyjs.com/en/features/dates/#format-options
    */
   format?: string;
};

const props = withDefaults(defineProps<Omit<TDateField, "title"> & TProps>(), {
   readonly: true,
   actions: true,
   hideDetails: false,
   closeOnPickerClick: true,
   showAdjacentMonths: true,
   firstDayOfWeek: 1,
   openOnClear: true,
   endOfDay: true, // end of day 23:59:59:999
   format: "fullDate"
});

defineOptions({ inheritAttrs: false });

const { t } = useI18n();
const date = useDate();

const model = defineModel({ type: [Object, String, null], default: null });
const menu = ref(false);
const display = computed(() => {
   if (!model.value || !date.isValid(model.value)) {
      return null;
   }
   return date.format(model.value, props.format);
});

const dateHandler = (value: Date, day?: number) => {
   if (typeof day === "number") {
      // ALTER
      // value = date.addDays(value, day) as Date;
      value.setDate(value.getDate() + day);
   }

   if (props.endOfDay) {
      model.value = date.endOfDay(value);
   } else {
      const now = new Date();
      value.setHours(now.getHours());
      value.setMinutes(now.getMinutes());
      value.setSeconds(now.getSeconds());
      value.setMilliseconds(now.getMilliseconds());
      model.value = value;
   }

   menu.value = !props.closeOnPickerClick;
};
</script>
