<script setup>
import { useToastStore } from "@/store/useToastStore";

const toastData = computed(() => useToastStore().toastData);
</script>

<template>
  <VSnackbar
    v-model="toastData.show"
    auto-height
    :location="toastData.location"
    variant="flat"
    :timeout="toastData.timeout"
    :color="toastData.color"
  >
    <VLayout align-center pr-4>
      <VIcon size="small" icon="tabler-bell"></VIcon>
      <VLayout class="ml-2" column>
        <div>{{ toastData.message }}</div>
      </VLayout>
    </VLayout>
  </VSnackbar>
</template>
