<script setup>
import { Head, Link, useForm, usePage } from "@inertiajs/vue3";
import { themeConfig } from "@themeConfig";
import { emailValidator, requiredValidator } from "@validators";
import authV1BottomShape from "@images/svg/auth-v1-bottom-shape.svg";
import authV1TopShape from "@images/svg/auth-v1-top-shape.svg";
import Layout from "@/layouts/blank.vue";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";

//layout
defineOptions({ layout: Layout });

//state

const state = reactive({
  status: null,
});

//form
const refForm = ref();
const form = useForm({
  email: "",
});

const submit = (d) => {
  refForm?.value?.validate().then((res) => {
    const { valid: isValid } = res;
    if (isValid) {
      form.post("/forgot-password", {
        preserveScroll: true,
        preserveState: true,
        onSuccess: (data) => {
          if (data && data.props && data.props.status) {
            state.status = data.props.status;
             setTimeout(() => {
              state.status = null;
            }, 10000);
          }
          form.reset("email");
        },
        onError: (data) => {

        },
      });
    }
  });
};
</script>

<template>
  <Head title="Forgot Password"></Head>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Top shape -->
      <!-- <VImg :src="authV1TopShape" class="auth-v1-top-shape d-none d-sm-block" /> -->

      <!-- 👉 Bottom shape -->
      <!--
        <VImg
        :src="authV1BottomShape"
        class="auth-v1-bottom-shape d-none d-sm-block"
      />
      -->

      <!-- 👉 Auth card -->
      <VCard class="auth-card pa-4" max-width="448">
        <VCardText>
          <h5 class="text-h5 font-weight-semibold mb-1">Forgot Password? 🔒</h5>
          <p class="mb-0">
            Enter your email and we'll send you instructions to reset your
            password
          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="submit" ref="refForm" validate-on="submit">
            <VRow v-if="state.status">
              <VCol cols="12">
                <VAlert variant="tonal" color="success" v-if="state.status">
                  {{ state.status }}
                </VAlert>
              </VCol>
            </VRow>
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  id="email"
                  v-model="form.email"
                  label="Email"
                  :rules="[requiredValidator, emailValidator]"
                  :error-messages="form.errors.email"
                  @input="form.clearErrors('email')"
                  :validate-on="fieldHasError(refForm?.errors, 'email')"
                />
              </VCol>

              <!-- Reset link -->
              <VCol cols="12">
                <VBtn
                  block
                  type="submit"
                  :disabled="form.processing"
                  @click="refForm?.validate()"
                >
                  Send Reset Link
                </VBtn>
              </VCol>

              <!-- back to login -->
              <VCol cols="12">
                <Link
                  class="d-flex align-center justify-center"
                  :href="route('login')"
                >
                  <VIcon icon="tabler-chevron-left" class="flip-in-rtl" />
                  <span>Back to login</span>
                </Link>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core-scss/template/pages/page-auth.scss";
</style>

