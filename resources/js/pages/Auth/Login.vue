<script setup>
import { Head, Link, useForm } from "@inertiajs/vue3";
import { themeConfig } from "@themeConfig";
import { emailValidator, requiredValidator } from "@validators";
import authV1BottomShape from "@images/svg/auth-v1-bottom-shape.svg";
import authV1TopShape from "@images/svg/auth-v1-top-shape.svg";
import Layout from "@/layouts/blank.vue";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { config } from '@layouts/config'

defineOptions({ layout: Layout });

defineProps({
  canResetPassword: Boolean,
  status: String,
});

const form = useForm({
  email: "",
  password: "",
  remember: false,
});

const isPasswordVisible = ref(false);
const refForm = ref();
const errors = ref({
  email: undefined,
  password: undefined,
});

const submit = (d) => {
  refForm?.value?.validate().then((res) => {
    const { valid: isValid } = res;
    if (isValid) {
      form.post("/login", {
        preserveScroll: true,
        preserveState: true,
        onSuccess: (data) => {
          console.log(data);
        },
      });

      form.post("/login", {
        // preserveScroll: true,
        // preserveState: true,
        onSuccess: (data) => {},
      });
    }
  });
};
</script>

<template>
  <Head title="Login"></Head>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Top shape -->
      <VImg :src="authV1TopShape" class="auth-v1-top-shape d-none d-sm-block" />

      <!-- 👉 Bottom shape -->
      <VImg
        :src="authV1BottomShape"
        class="auth-v1-bottom-shape d-none d-sm-block"
      />

      <!-- 👉 Auth card -->
      <VCard class="auth-card pa-4" max-width="448">
        <VCardText class="text-center">
          <!--
 <VNodeRenderer
            :nodes="themeConfig.app.logoDark"
          /> 
-->
        </VCardText>
        <VCardText>
          <h5 class="text-h5 font-weight-semibold mb-1">
            Welcome to {{ themeConfig.app.title }}! 👋
          </h5>
          <p class="mb-0">Please sign-in to your account</p>
        </VCardText>
        <VCardText>
          <VForm @submit.prevent="submit" ref="refForm" validate-on="submit">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  id="email"
                  v-model="form.email"
                  label="Email"
                  :rules="[requiredValidator, emailValidator]"
                  :error-messages="form.errors.email"
                  :validate-on="fieldHasError(refForm?.errors, 'email')"
                  @input="form.clearErrors('email')"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  id="password"
                  label="Password"
                  v-model="form.password"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :error-messages="form.errors.password"
                  :append-inner-icon="
                    isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  @input="form.clearErrors('password')"
                  :validate-on="fieldHasError(refForm?.errors, 'password')"
                />

                <div
                  class="d-flex align-center flex-wrap justify-space-between mt-2 mb-4"
                >
                  <VCheckbox
                    v-model="form.remember"
                    label="Remember Me"
                    class="remember-me w-50"
                  />

                  <Link
                    class="text-primary ms-2 mb-1"
                    :href="route('password.request')"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <VBtn block type="submit" @click="refForm?.validate()">
                  Login
                </VBtn>
              </VCol>

              <!-- create account -->
              <!--
                <VCol cols="12" class="text-center">
                <span>New on our platform?</span>
                <Link
                  class="text-primary ms-2"
                  :href="route('register')"
                >
                  Create an account
                </Link>
              </VCol>
              -->
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
