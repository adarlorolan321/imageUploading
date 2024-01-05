<script setup>
import { useSkins } from "@core/composable/useSkins";
import { useThemeConfig } from "@core/composable/useThemeConfig";

// @layouts plugin
import { AppContentLayoutNav } from "@layouts/enums";
import App from "../App.vue";
import { computed } from "vue";
import { usePage } from "@inertiajs/vue3";
import { useAppAbility } from "@/plugins/casl/useAppAbility";
import { useToastStore } from "@/store/useToastStore";

const DefaultLayoutWithVerticalNav = defineAsyncComponent(() =>
  import("./components/DefaultLayoutWithVerticalNav.vue"),
);

const { width: windowWidth } = useWindowSize();

const { appContentLayoutNav, switchToVerticalNavOnLtOverlayNavBreakpoint } =
  useThemeConfig();

// Remove below composable usage if you are not using horizontal nav layout in your app
switchToVerticalNavOnLtOverlayNavBreakpoint(windowWidth);

const { layoutAttrs, injectSkinClasses } = useSkins();

injectSkinClasses();

const user = computed(() => usePage().props.auth.user);
const userAbilities = computed(() => usePage().props.auth.permission);
const flash = computed(() => usePage().props.status);
const userProps = computed(() => usePage().props);
const ability = useAppAbility();
const { openToast } = useToastStore();

const arr = userAbilities.value.map((p) => {
  return {
    action: p,
  };
});

ability.update(arr);

const status = computed(() => usePage().props.status);
const success = computed(() => usePage().props.success);
const error = computed(() => usePage().props.error);

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
    <DefaultLayoutWithVerticalNav v-bind="layoutAttrs">
      <slot />
    </DefaultLayoutWithVerticalNav>
  </App>
</template>

<style lang="scss">
// As we are using `layouts` plugin we need its styles to be imported
@use "@layouts/styles/default-layout";
</style>
