<script setup>
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import { themeConfig } from '@themeConfig';
import { emailValidator, requiredValidator, passwordValidator, confirmedValidator } from '@validators';
import authV1BottomShape from '@images/svg/auth-v1-bottom-shape.svg';
import authV1TopShape from '@images/svg/auth-v1-top-shape.svg';
import Layout from '@/layouts/blank.vue';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';

import AppToast from "@core/components/AppToast.vue";
import { useToastStore } from "@/store/useToastStore";

const { openToast } = useToastStore();

//layout
defineOptions({ layout: Layout });

const state = reactive({
  status: null,
});

//props
const props = defineProps({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

//refs
const refForm = ref();
const isPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);

const form = useForm({
  email: props.email,
  token: props.token,
  password: '',
  password_confirmation: '',
});

const submit = d => {
  refForm?.value?.validate().then(res => {
    const { valid: isValid } = res;

    if (isValid) {
      form.post(route('password.store'), {
        preserveScroll: true,
        onSuccess: data => {
            openToast({
                color: "success",
                message: "Your password has been reset",
            });
            router.get('/login')
        },
      });
    }
  });
};
</script>

<template>
  <Head title="Reset Password"></Head>
  <AppToast />
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Top shape -->
      <!-- <VImg :src="authV1TopShape" class="auth-v1-top-shape d-none d-sm-block" /> -->

      <!-- 👉 Bottom shape -->
      <!-- <VImg :src="authV1BottomShape" class="auth-v1-bottom-shape d-none d-sm-block" /> -->

      <!-- 👉 Auth card -->
      <VCard class="auth-card pa-4" max-width="448">
        <VCardText>
          <h5 class="text-h5 font-weight-semibold mb-1">Reset Password 🔒</h5>
          <p class="mb-0">Enter new password</p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="submit" ref="refForm" validate-on="submit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="form.email"
                  label="Email"
                  :rules="[requiredValidator, emailValidator]"
                  :error-messages="form.errors.email"
                  readonly
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12">
                <VTextField
                  id="password"
                  v-model="form.password"
                  :rules="[requiredValidator, passwordValidator]"
                  label="Password"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  :error-messages="form.errors.password"
                  @input="form.clearErrors('password')"
                  :validate-on="fieldHasError(refForm?.errors, 'password') == 'submit' ? 'blur' : 'input'"
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  id="Password_confirmation"
                  v-model="form.password_confirmation"
                  :rules="[requiredValidator, confirmedValidator(form.password, form.password_confirmation)]"
                  label="Confirm Password"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                  :error-messages="form.errors.password_confirmation"
                  @input="form.clearErrors('password_confirmation')"
                  :validate-on="fieldHasError(refForm?.errors, 'password_confirmation') == 'submit' ? 'blur' : 'input'"
                />
              </VCol>
            </VRow>

            <VRow>
              <!-- Reset link -->
              <VCol cols="12">
                <VBtn block type="submit" @click="refForm?.validate()" :disabled="form?.processing">
                  Reset password
                </VBtn>
              </VCol>

              <!-- back to login -->
              <VCol cols="12">
                <Link class="d-flex align-center justify-center" :href="route('login')">
                  <VIcon icon="tabler-chevron-left" class="flip-in-rtl" />
                  <span>Back to login</span>
                </Link>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <VDialog persistent v-model="state.status" width="500">
          <!-- Dialog Content -->
          <VCard class="text-center">
            <VCardText class="d-flex flex-column justify-center align-center">
              <VAvatar color="success" variant="tonal" size="50" class="mb-4">
                <VIcon size="2rem" icon="tabler-thumb-up" />
              </VAvatar>
              <h6 class="text-h6">Success</h6>
            </VCardText>
            <VCardText>
              <p>Your password has been reset!</p>
            </VCardText>
            <VCardActions class="justify-center">
              <Link class="d-flex align-center justify-center" :href="route('login')">
                <VBtn variant="elevated"> Login </VBtn>
              </Link>
            </VCardActions>
          </VCard>
        </VDialog>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use '@core-scss/template/pages/page-auth.scss';
</style>
