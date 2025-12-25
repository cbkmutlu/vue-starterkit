<template>
   <Container max-width="900">
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
                  <v-text-field v-bind:rules="[appRules.required()]" />
               </v-col>

               <v-col md="6">
                  <ListTitle
                     title="Yeni Şifre"
                     prepend-icon="$lock"
                     subtitle="Yeni şifrenizi yazın" />
               </v-col>
               <v-col md="6">
                  <v-text-field v-bind:rules="[appRules.required()]" />
               </v-col>

               <v-col md="6">
                  <ListTitle
                     title="Yeni Şifre Tekrar"
                     prepend-icon="$lock"
                     subtitle="Yeni şifrenizi tekrar yazın" />
               </v-col>
               <v-col md="6">
                  <v-text-field v-bind:rules="[appRules.required()]" />
               </v-col>
            </v-row>
         </v-card-text>

         <v-card-actions>
            <v-spacer />
            <v-btn
               color="primary"
               density="comfortable"
               text="Şifreyi Güncelle"
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
</script>
