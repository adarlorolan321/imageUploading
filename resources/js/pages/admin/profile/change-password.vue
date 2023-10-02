<script setup>
import { Head, useForm } from "@inertiajs/vue3";
import {
  requiredValidator,
  confirmedValidator,
  passwordValidator,
} from "@validators";

import AppToast from "@core/components/AppToast.vue";
import { useToastStore } from "@/store/useToastStore";

const { openToast } = useToastStore();

const isCurrentPasswordVisible = ref(false);
const isNewPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");
const refForm = ref();

const passwordRequirements = [
  "Minimum 8 characters",
  "At least 1 uppercase",
  "At least 1 lowercase",
  "At least 1 special character",
];

const form = useForm({
  current_password: "",
  password: "",
  password_confirmation: "",
});

const resetForm = () => {
    form.reset();
}

const updatePassword = () => {
  refForm?.value?.validate().then((res) => {
    const { valid: isValid } = res;
    if (isValid) {
      form.put(route("password.update"), {
        preserveScroll: true,
        onSuccess: () => {
          form.reset()
          openToast({
                color: "success",
                message: "Record saved",
            });
        },
        onError: () => {
          if (form.errors.password) {
            form.reset("password", "password_confirmation");
          }
          if (form.errors.current_password) {
            form.reset("current_password");
          }
        },
      });
    }
  });
};
</script>

<template>
  <AppToast />
  <VRow>
    <!-- SECTION: Change Password -->
    <VCol cols="12">
      <VCard title="Change Password">
        <VForm ref="refForm" @submit.prevent="updatePassword" validate-on="submit">
          <VCardText class="pt-0">
            <!-- 👉 Current Password -->
            <VRow class="mb-3">
              <VCol cols="12" md="6">
                <!-- 👉 current password -->
                <VTextField
                  id="current_password"
                  :rules="[requiredValidator]"
                  v-model="form.current_password"
                  :type="isCurrentPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isCurrentPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  label="Current Password"
                  @click:append-inner="
                    isCurrentPasswordVisible = !isCurrentPasswordVisible
                  "
                  :error-messages="form.errors.current_password"
                  :validate-on="fieldHasError(refForm?.errors, 'current_password')"
                  @input="form.clearErrors('current_password')"
                />
              </VCol>
            </VRow>

            <!-- 👉 New Password -->
            <VRow>
              <VCol cols="12" md="6">
                <!-- 👉 new password -->
                <VTextField
                  id="password"
                  v-model="form.password"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isNewPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  label="New Password"
                  @click:append-inner="
                    isNewPasswordVisible = !isNewPasswordVisible
                  "
                  :rules="[requiredValidator, passwordValidator]"
                  :validate-on="fieldHasError(refForm?.errors, 'password') == 'submit' ? 'blur': 'input'"
                  @input="form.clearErrors('password')"
                />
              </VCol>

              <VCol cols="12" md="6">
                <!-- 👉 confirm password -->
                <VTextField
                  id="password_confirmation"
                  v-model="form.password_confirmation"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="
                    isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'
                  "
                  label="Confirm New Password"
                  @click:append-inner="
                    isConfirmPasswordVisible = !isConfirmPasswordVisible
                  "
                  :rules="[
                    requiredValidator,
                    confirmedValidator(
                      form.password,
                      form.password_confirmation
                    ),
                  ]"
                  :validate-on="fieldHasError(refForm?.errors, 'password_confirmation') == 'submit' ? 'blur': 'input'"
                  @input="form.clearErrors('password_confirmation')"
                />
              </VCol>
            </VRow>
          </VCardText>

          <!-- 👉 Password Requirements -->
          <VCardText>
            <h6 class="text-base font-weight-medium mb-3">
              Password Requirements:
            </h6>

            <VList class="card-list">
              <VListItem
                v-for="item in passwordRequirements"
                :key="item"
                :title="item"
                class="text-medium-emphasis"
              >
                <template #prepend>
                  <VIcon size="8" icon="tabler-circle" class="me-3" />
                </template>
              </VListItem>
            </VList>
          </VCardText>

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn type="submit" @click="refForm?.validate()">Save changes</VBtn>
            <!-- <VBtn type="reset" color="secondary" variant="tonal" @click="resetForm"> Reset </VBtn> -->
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 5px;
}

.server-close-btn {
  inset-inline-end: 0.5rem;
}
</style>
