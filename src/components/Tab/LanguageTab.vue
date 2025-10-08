<template>
   <v-tabs
      v-model="model"
      v-bind:color="props.color"
      v-bind:disabled="props.loading">
      <v-tab
         v-bind:loading="props.loading && model === 1"
         v-bind:value="1">
         {{ t("app.turkish") }}
      </v-tab>
      <v-tab
         v-bind:loading="props.loading && model === 2"
         v-bind:value="2">
         {{ t("app.english") }}
      </v-tab>
      <v-menu transition="dialog-transition">
         <template v-slot:activator="{ props: menuProps }">
            <v-btn
               v-bind="menuProps"
               v-bind:color="props.color"
               height="100%"
               rounded="0">
               <v-icon>$plus</v-icon>
            </v-btn>
         </template>

         <v-list
            v-bind:slim="false"
            class="select-none">
            <v-list-item
               v-for="(locale, key) in appConfig.language.locales"
               @click="console.log(key)">
               <template v-slot:append>
                  <v-icon v-html="locale.flag" />
               </template>

               <template v-slot:title>
                  {{ locale.name }}
               </template>
            </v-list-item>
         </v-list>
      </v-menu>
   </v-tabs>
</template>

<script lang="ts" setup>
const { t } = useI18n();
const model = defineModel({ type: Number, default: 1 });
const props = defineProps({
   loading: {
      type: Boolean,
      default: false
   },
   color: {
      type: String,
      default: "primary"
   }
});
</script>
