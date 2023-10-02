<script setup>
    const props = defineProps({
        serverQuery: {
            type: Object,
        },
        serverQueryKey: {
            type: String,
        },
        sorting: {
          type: Boolean,
          default: false,
        },
    });

    const sortUp = computed(() => props.serverQuery.sort == props.serverQueryKey && props.serverQuery.order == 'desc');
    const sortDown = computed(() => props.serverQuery.sort == props.serverQueryKey && props.serverQuery.order == 'asc');
</script>

<template>
  <th class="sortable text-uppercase">
    <slot></slot>
    <VIcon icon="tabler-arrow-narrow-up" v-if="sortUp && sorting" size="x-small"></VIcon>
    <VIcon icon="tabler-arrow-narrow-down" v-if="sortDown && sorting" size="x-small"></VIcon>
  </th>
</template>

<style scoped>
.sortable{
  cursor: pointer;
}
</style>
