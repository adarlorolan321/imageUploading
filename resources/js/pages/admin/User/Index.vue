<script setup>
    import Layout from "@/layouts/default.vue";
    import DataTable from '@core/components/DataTable.vue';
    import { ref } from "vue"

    defineOptions({ layout: Layout });

    const headers = ref([
      { key: 'id', title: 'Id', sortable: true }, 
      { key: 'first_name', title: 'Full Name', sortable: true },
      { key: 'last_name', title: 'Last Name', sortable: true },
      { key: 'email', title: 'Email', sortable: true },
      { key: 'actions', title: 'Action' },
    ]);
</script>

<template>
  <DataTable :route="route('admin.users.index')" :headers="headers" />
</template>