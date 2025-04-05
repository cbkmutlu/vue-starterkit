<template>
   <v-card>
      <v-card-text>
         <TextFieldExample
            v-bind:rules="[appRules.required(), appRules.minval(2, (m) => t(m))]"
            color="primary"
            label="test"
            prepend-icon="$search"
            variant="underlined" />

         <v-row>
            <v-col cols="2">
               <DatePicker
                  v-model="createDate"
                  v-bind:label="t('app.date')"
                  v-bind:rules="[appRules.required()]"
                  :show-adjacent-months="false" />
            </v-col>
            <v-col cols="2">
               <DatePicker
                  v-model="createDate"
                  v-bind:label="t('app.date')"
                  v-bind:rules="[appRules.required()]"
                  empty="Empty Test"
                  show-adjacent-months />
            </v-col>
            <v-col cols="2">
               <DatePicker
                  v-model="createDate"
                  v-bind:label="t('app.date')"
                  v-bind:rules="[appRules.required()]"
                  title="Prop Test"
                  empty="Empty Test" />
            </v-col>
            <v-col cols="2">
               <DatePicker
                  v-model="createDate"
                  v-bind:actions="false"
                  v-bind:label="t('app.date')"
                  v-bind:open-on-clear="false"
                  v-bind:rules="[appRules.required()]"
                  empty="Empty Test"
                  hide-details
                  hide-weekdays>
                  <template v-slot:title>Slot Test</template>
               </DatePicker>
            </v-col>
            <v-col cols="2">
               <v-btn
                  variant="tonal"
                  @click="showDate">
                  Show Date
               </v-btn>
            </v-col>
         </v-row>

         <v-row>
            <v-col cols="2">
               <SelectInput
                  v-model="selectedList"
                  v-bind:items="dataList"
                  v-bind:label="t('app.select')"
                  v-bind:rules="[appRules.required()]"
                  item-title="state"
                  item-value="id"
                  multiple
                  return-object />
            </v-col>
            <v-col cols="2">
               <SelectInput
                  v-model="selectedList"
                  v-bind:items="dataList"
                  v-bind:label="t('app.select')"
                  v-bind:rules="[appRules.required()]"
                  item-title="state"
                  item-value="id"
                  multiple
                  return-object />
            </v-col>
            <v-col cols="2">
               <SelectInput
                  v-model="selected"
                  v-bind:count="4"
                  v-bind:items="dataList"
                  v-bind:label="t('app.select')"
                  v-bind:open-on-clear="false"
                  v-bind:rules="[appRules.required()]"
                  item-title="state"
                  item-value="id"
                  return-object />
            </v-col>
            <v-col cols="2">
               <v-btn
                  variant="tonal"
                  @click="showSelected">
                  Show Selected
               </v-btn>
            </v-col>
         </v-row>

         <v-row>
            <v-col cols="2">
               <v-btn
                  variant="tonal"
                  @click="confirmHandler">
                  Open Confirm
               </v-btn>
            </v-col>

            <v-col cols="2">
               <v-btn
                  variant="tonal"
                  @click="promptHandler">
                  Open Prompt
               </v-btn>
            </v-col>
         </v-row>
      </v-card-text>
   </v-card>
</template>

<script lang="ts" setup>
import DatePicker from "@/assets/components/Input/DatePicker.vue";
import SelectInput from "@/assets/components/Input/SelectInput.vue";
import TextFieldExample from "@/assets/components/Input/TextFieldExample.vue";

const { t } = useI18n();
const confirmStore = useConfirmStore();
const promptStore = usePromptStore();

const createDate = ref(null);

const selectedList = ref([]);
const selected = ref(null);

// const dataList = [
//    { state: "Florida", id: 1 },
//    { state: "Georgia", id: 2 },
//    { state: "Nebraska", id: 3 },
//    { state: "California", id: 4 },
//    { state: "New York", id: 5 }
// ];
const dataList = computed(() => {
   return [
      { state: "Florida", id: 1 },
      { state: "Georgia", id: 2 },
      { state: "Nebraska", id: 3 },
      { state: "California", id: 4 },
      { state: "New York", id: 5 }
   ];
});

const showDate = () => console.log(createDate.value);
const showSelected = () => {
   console.log(selectedList.value);
   console.log(selected.value);
};

const confirmHandler = async () => {
   confirmStore
      .open({
         message: "Are you sure?",
         acceptText: t("app.yes")
      })
      .then((confirm) => console.log(confirm))
      .catch((e: any) => console.log(e))
      .finally(() => confirmStore.close());
};

const promptHandler = async () => {
   promptStore
      .open({
         label: "Enter your name",
         callback: (value) => {
            return upperCase(value);
         },
         // callback: upperCase,
         rules: [appRules.required()]
      })
      .then(() => console.log(promptStore.dialog.message))
      .catch((e: any) => console.log(e))
      .finally(() => promptStore.close());
};
</script>
