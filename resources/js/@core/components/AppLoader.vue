<script setup>
import { useAppStore } from "@/store/useAppStore";

const loadingData = computed(() => useAppStore().loadingData);
</script>

<template>
  <!-- Dialog -->
  <VDialog
    v-model="loadingData.show"
    :width="loadingData.width"
    persistent
  >
    <VCard
      :color="loadingData.color"
      :width="loadingData.width"
    >
      <VCardText class="pt-3">
        {{ loadingData.message }}
        <VProgressLinear
          indeterminate
          color="white"
          class="mb-0"
        />
      </VCardText>
    </VCard>
  </VDialog>
</template>
