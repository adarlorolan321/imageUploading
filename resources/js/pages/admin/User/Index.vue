<script setup>
    import Layout from "@/layouts/default.vue";
    import DataTable from '@core/components/DataTable.vue';

    defineOptions({ layout: Layout });
</script>

<template>
  <DataTable :route="route('admin.users.index')" :headers="[{key: 'id', title: 'Id', sortable: true}]" />
</template>