<script setup>
import { useForm, usePage } from '@inertiajs/vue3';
import {
  emailValidator,
  requiredValidator,
} from '@validators';

import AppToast from "@core/components/AppToast.vue";
import { useToastStore } from "@/store/useToastStore";

const { openToast } = useToastStore();


//props
const user = usePage().props.auth.user;
const props = defineProps({
  countries: Array,
});

// state
const state = reactive({
  avatarImg: user.avatar || null,
});

//store
const form = useForm({
  first_name: user.first_name,
  last_name: user.last_name,
  email: user.email,
  phone: user.phone,
  avatar: "",
  avatar_action: "",
});

// refs
const refInputEl = ref();
const refForm = ref();

// actions
const resetForm = () => {
  form.reset();
  form.clearErrors();
};

const changeAvatar = file => {
  form.clearErrors('avatar');

  const fileReader = new FileReader();
  const { files } = file.target;
  if (files && files.length) {
    form.avatar = files[0];
    if ((form.avatar.size / (1024 * 1024)) > 2) {
      form.setError('avatar', 'File is too big');
    }
    fileReader.readAsDataURL(files[0]);
    fileReader.onload = () => {
      if (typeof fileReader.result === 'string') state.avatarImg = fileReader.result;
    };
  }
};

// reset avatar image
const resetAvatar = () => {
  state.avatarImg = null;
  form.avatar_action = 'delete';
  form.avatar = "";
  form.clearErrors('avatar');
};

const updateProfile = () => {
  refForm?.value?.validate().then(res => {
    const { valid: isValid } = res;
    if (isValid && Object.keys(form.errors).length == 0) {
      form.transform(data => ({
        ...data,
        _method: 'put',
      }))
        .post(route('admin.profile'), {
          preserveScroll: true,
          onSuccess: () => {
            form.avatar_action = "";
            openToast({
                color: "success",
                message: "Record saved",
            });
          },
          onError: () => { },
        });
    }
  });
};
</script>

<template>
  <AppToast />
  <VRow>
    <VCol cols="12">
      <VCard title="Profile Details">
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar size="100" class="me-6" rounded="0" v-if="state.avatarImg">
            <VImg cover :src="state.avatarImg" />
          </VAvatar>
          <VAvatar size="100" class="me-6" rounded="0" v-else>
            <VIcon color="primary" size="100" icon="tabler-user-circle" />
          </VAvatar>

          <!-- 👉 Upload Photo -->
          <div class="d-flex flex-column justify-center gap-2">
            <div class="d-flex flex-wrap gap-2">
              <VBtn color="primary" variant="outlined" @click="refInputEl?.click()">
                <VIcon icon="tabler-cloud-upload" class="d-sm-none" />
                <span class="d-none d-sm-block">Upload new photo</span>
              </VBtn>

              <input
                ref="refInputEl" type="file" name="file" accept=".jpeg,.png,.jpg,GIF" hidden
                @input="changeAvatar"
              />

              <VBtn type="reset" color="secondary" variant="tonal" @click="resetAvatar">
                <span class="d-none d-sm-block">Reset</span>
                <VIcon icon="tabler-refresh" class="d-sm-none" />
              </VBtn>
            </div>

            <p class="text-body-1 mb-0">Allowed JPG, GIF or PNG (Max 2MB)</p>
            <div class="v-input v-input--horizontal v-input--density-compact v-input--error v-text-field">
              <div class="v-input__details">
                <div class="v-messages">
                  <div class="v-messages__message invalid"> {{ form.errors.avatar }}</div>
                </div>
              </div>
            </div>
          </div>
        </VCardText>

        <VDivider />

        <VCardText class="pt-2">
          <!-- 👉 Form -->
          <VForm class="mt-6" ref="refForm" @submit.prevent="updateProfile" validate-on="submit">
            <VRow class="pt-4">
              <VCol cols="12" md="6">
                <VTextField
                  id="first_name" v-model="form.first_name" :rules="[requiredValidator]"
                  label="First Name" :error-messages="form.errors.first_name"
                  validate-on="input" @update:model-value="form.clearErrors('first_name')"
                />
              </VCol>
              <VCol cols="12" md="6">
                <VTextField
                  id="last_name" v-model="form.last_name" :rules="[requiredValidator]"
                  label="Last Name" :error-messages="form.errors.last_name"
                  validate-on="input" @update:model-value="form.clearErrors('last_name')"
                />
              </VCol>
            </VRow>

            <VRow>
              <VCol cols="12" md="12">
                <VTextField
                  v-model="form.email" :rules="[requiredValidator, emailValidator]" label="Email"
                  :error-messages="form.errors.email" validate-on="input"
                  @update:model-value="form.clearErrors('email')"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn type="submit" :disabled="form.processing">Save changes</VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.invalid {
  color: rgb(var(--v-theme-error));
}
</style>
