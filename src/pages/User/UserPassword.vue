<template>
   <Container
      v-model="form"
      v-bind:onSubmit="formHandler"
      ref="formRef">
      <Header>
         <template v-slot:title>Şifre Değiştir</template>
         <template v-slot:subtitle>Şifrenizi buradan değiştirebilirsiniz.</template>
      </Header>

      <Content>
         <v-card-text>
            <v-row no-gutters>
               <v-col md="6">
                  <ListTitle
                     title="Eski Şifre"
                     prepend-icon="$lock"
                     subtitle="Eski şifrenizi yazın" />
               </v-col>
               <v-col md="6">
                  <v-text-field
                     v-model="payload.password"
                     v-bind:rules="[appRules.required()]" />
               </v-col>

               <v-col md="6">
                  <ListTitle
                     title="Yeni Şifre"
                     prepend-icon="$lock"
                     subtitle="Yeni şifrenizi yazın" />
               </v-col>
               <v-col md="6">
                  <v-text-field
                     v-model="payload.new_password"
                     v-bind:rules="[appRules.required()]" />
               </v-col>

               <v-col md="6">
                  <ListTitle
                     title="Yeni Şifre Tekrar"
                     prepend-icon="$lock"
                     subtitle="Yeni şifrenizi tekrar yazın" />
               </v-col>
               <v-col md="6">
                  <v-text-field
                     v-model="payload.confirm_password"
                     v-bind:rules="[appRules.required(), appRules.sameAs(() => payload.new_password)]" />
               </v-col>
            </v-row>
         </v-card-text>

         <v-card-actions>
            <v-spacer />
            <v-btn
               v-bind:disabled="!form"
               type="submit"
               color="primary"
               density="default"
               text="Şifreyi Güncelle"
               variant="tonal" />
         </v-card-actions>
      </Content>
   </Container>
</template>

<script lang="ts" setup>
import ListTitle from "@/components/List/ListTitle.vue";
import Container from "@/components/Page/Container.vue";
import Content from "@/components/Page/Content.vue";
import Header from "@/components/Page/Header.vue";

// states
const payload = ref({
   password: "",
   new_password: "",
   confirm_password: ""
});

const form = ref(false);
const formRef = ref<InstanceType<typeof Container>>();

// handlers
const formHandler = async () => {
   formRef.value?.form?.reset();
};
</script>
