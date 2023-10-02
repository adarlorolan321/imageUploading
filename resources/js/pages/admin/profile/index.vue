<script setup>
import AccountSettingsAccount from "@/pages/admin/profile/account-details.vue";
import AccountSettingsSecurity from "@/pages/admin/profile/change-password.vue";
import Layout from "@/layouts/default.vue";
import { Head } from '@inertiajs/vue3';

//layout
defineOptions({ layout: Layout });

//state
const activeTab = ref(0);

// tabs
const tabs = [
  {
    title: "Account",
    icon: "tabler-users",
    tab: "account",
  },
  {
    title: "Security",
    icon: "tabler-lock",
    tab: "security",
  },
];

const changeTab = (item) => {
    activeTab.value = item.tab;
};
</script>

<template>
  <Head title="Profile"></Head>
  <div>
    <VTabs
      v-model="activeTab"
      class="v-tabs-pill"
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
        @click="changeTab(item)"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>

    <VWindow
      v-model="activeTab"
      class="mt-6 disable-tab-transition"
      :touch="false"
    >
      <!-- Account -->
      <VWindowItem value="account">
        <AccountSettingsAccount />
      </VWindowItem>

      <!-- Security -->
      <VWindowItem value="security">
        <AccountSettingsSecurity />
      </VWindowItem>
    </VWindow>
  </div>
</template>
