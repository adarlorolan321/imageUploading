<script setup>
import { Head } from "@inertiajs/vue3";
import Layout from "@/layouts/default.vue";
import AppComingSoon from "@core/components/AppComingSoon.vue";

defineOptions({ layout: Layout });

</script>

<template>
  <Head title="Dashboard"></Head>
  <AppComingSoon />
</template>
