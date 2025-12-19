<template>
   <Content class="bg-noise bg-white/80">
      <template v-slot:title>{{ t("app.userlogin") }}</template>
      <v-form
         v-model="validate"
         @submit.prevent="validate && loginHandler()">
         <v-card-text>
            <v-list-subheader class="min-h-6">{{ t("app.email") }}</v-list-subheader>
            <v-text-field
               v-model="email"
               v-bind:clearable="false"
               v-bind:rules="[appRules.required()]"
               name="email"
               hide-details />
            <v-list-subheader class="mt-2 min-h-6">{{ t("app.password") }}</v-list-subheader>
            <v-text-field
               v-model="password"
               v-bind:clearable="false"
               v-bind:rules="[appRules.required()]"
               v-bind:type="show ? 'text' : 'password'"
               hide-details>
               <template v-slot:append-inner>
                  <v-btn
                     density="compact"
                     icon
                     variant="plain"
                     @click="show = !show">
                     <ToggleIcon
                        v-bind:icon="['$eyeOn', '$eyeOff']"
                        v-bind:toggle="show" />
                  </v-btn>
               </template>
            </v-text-field>
         </v-card-text>
         <v-card-actions class="justify-end px-4">
            <v-btn
               v-bind:loading="isPending"
               type="submit"
               color="primary"
               density="default"
               variant="tonal">
               {{ t("app.login") }}
            </v-btn>
         </v-card-actions>
      </v-form>
   </Content>
</template>

<script lang="ts" setup>
import Content from "@/components/Page/Content.vue";
import ToggleIcon from "@/components/Form/ToggleIcon.vue";
import { useLoginUser } from "@/services/UserService";

// hooks
const { t } = useI18n();
const authStore = useAuthStore();
const snackbarStore = useSnackbarStore();

// states
const email = ref();
const password = ref();
const show = ref(false);
const validate = ref(false);

// services
const { mutateAsync: loginUser, isPending } = useLoginUser();

// handlers
const loginHandler = async () => {
   try {
      const { data } = await loginUser({ email: email.value, password: password.value });
      snackbarStore.success();
      authStore.userLogin({
         currentUser: data.user_id,
         accessToken: data.access_token,
         refreshToken: data.refresh_token
      });
   } catch (error) {
      snackbarStore.error(error);
   }
};
</script>
