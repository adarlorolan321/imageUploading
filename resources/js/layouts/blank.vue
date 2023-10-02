<script setup>
import { useSkins } from "@core/composable/useSkins";
import AppToast from "@core/components/AppToast.vue";
import AppLoader from "@core/components/AppLoader.vue";
import { usePage } from "@inertiajs/vue3";
import { useToastStore } from "@/store/useToastStore";

const { injectSkinClasses } = useSkins();
const { openToast } = useToastStore();

injectSkinClasses();

const userProps = computed(() => usePage().props);

watch(userProps, (userProps) => {
  if (userProps.success) {
    openToast({
      color: "success",
      message: userProps.success,
    });
  }
  if (userProps.error) {
    openToast({
      color: "error",
      message: userProps.error,
    });
  }
});
</script>

<template>
  <App>
    <AppToast />
    <AppLoader />
    <div class="layout-wrapper layout-blank">
      <slot />
    </div>
  </App>
</template>

<style>
.layout-wrapper.layout-blank {
  flex-direction: column;
}
</style>
