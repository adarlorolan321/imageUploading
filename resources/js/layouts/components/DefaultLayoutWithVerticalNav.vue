<script setup>
import navItems from "@/navigation/admin";
import staffNav from "@/navigation/staff";
import { useThemeConfig } from "@core/composable/useThemeConfig";
import AppLoader from "@core/components/AppLoader.vue";

// Components
import Footer from "@/layouts/components/Footer.vue";
import AppToast from "@core/components/AppToast.vue";
import UserProfile from "@/layouts/components/UserProfile.vue";
import { useWindowSize } from "@vueuse/core";

// @layouts plugin
import { VerticalNavLayout } from "@layouts";
import { computed } from "vue";
import { usePage } from "@inertiajs/vue3";

const { appRouteTransition, isLessThanOverlayNavBreakpoint } = useThemeConfig();
const { width: windowWidth } = useWindowSize();

const user = computed(() => usePage().props.auth.user);

// const role = user.value.roles.length > 0 ? user.value.roles[0] : "";

// let updatedNavItems = [];
// if (role) {
//   if (role.name == 'Admin') {
//     updatedNavItems = navItems;
//   } else {
//     updatedNavItems = staffNav;
//   }
// };
</script>

<template>
  <VerticalNavLayout :nav-items="navItems">
    <!-- 👉 navbar -->
    <template #navbar="{ toggleVerticalOverlayNavActive }">
      <div class="d-flex h-100 align-center">
        <VBtn
          v-if="isLessThanOverlayNavBreakpoint(windowWidth)" icon variant="text" color="default" class="ms-n3"
          size="small" @click="toggleVerticalOverlayNavActive(true)"
        >
          <VIcon icon="tabler-menu-2" size="24" />
        </VBtn>

        <!-- <NavSearchBar class="ms-lg-n3" /> -->
        <AppToast />
        <AppLoader />

        <VSpacer />

        <!-- <NavBarI18n /> -->
        <!-- <NavbarThemeSwitcher /> -->
        <!-- <NavbarShortcuts /> -->
        <!-- <NavBarNotifications class="me-2" /> -->
        <UserProfile />
      </div>
    </template>

    <!-- 👉 Pages -->
    <slot />

    <!-- 👉 Footer -->
    <template #footer>
      <Footer />
    </template>

    <!-- 👉 Customizer -->
    <!-- <TheCustomizer /> -->
  </VerticalNavLayout>
</template>
