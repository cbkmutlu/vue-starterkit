<template>
   <Container max-width="900">
      <Header>
         <template v-slot:title>Kullanıcı Bilgileri</template>
         <template v-slot:subtitle>Kullanıcı bilgilerinizi buradan düzenleyebilirsiniz.</template>
      </Header>

      <Content>
         <v-card-text>
            <v-row no-gutters>
               <v-col md="6">
                  <ListTitle
                     title="İsim Soyisim"
                     prepend-icon="$user"
                     subtitle="İsim soyisim bilgisini yazın" />
               </v-col>
               <v-col md="6">
                  <v-text-field v-bind:rules="[appRules.required()]" />
               </v-col>

               <v-col md="6">
                  <ListTitle
                     title="Eposta Adresi"
                     prepend-icon="$mail"
                     subtitle="Eposta adresini yazın" />
               </v-col>
               <v-col md="6">
                  <v-text-field v-bind:rules="[appRules.required(), appRules.email()]" />
               </v-col>

               <v-col md="6">
                  <ListTitle
                     title="Telefon Numarası"
                     prepend-icon="$phone"
                     subtitle="Telefon numarasını yazın" />
               </v-col>
               <v-col md="6">
                  <v-text-field
                     v-bind:rules="[appRules.required(), appRules.pattern(/^0?5\d{2}\s\d{3}\s\d{4}$/, t('rules.phone'))]"
                     v-maska="{ mask: '0A## ### ####', tokens: { A: { pattern: /[1-9]/ } } }" />
               </v-col>
            </v-row>
         </v-card-text>

         <v-card-actions>
            <v-spacer />
            <v-btn
               color="primary"
               density="comfortable"
               text="Kullanıcı Bilgilerini Güncelle"
               variant="text" />
         </v-card-actions>
      </Content>
   </Container>
</template>

<script lang="ts" setup>
import ListTitle from "@/components/List/ListTitle.vue";
import Container from "@/components/Page/Container.vue";
import Content from "@/components/Page/Content.vue";
import Header from "@/components/Page/Header.vue";

const { t } = useI18n();
</script>
