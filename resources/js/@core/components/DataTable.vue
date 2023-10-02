<script setup>
	import { useDataTable } from '@core/composable/useDatatable'

	const props = defineProps({
		route: {
			type: String,
			default: "/",
		},
		headers: {
			type: Array,
			default: () => [],
		},
        additionalParams: {
            type: Array,
            default: () => [],
        },
	})

	const { formParams, perPageList, handleSearch, data, pagination, handleSort } = useDataTable(props.route, ['data', 'params'], props.additionalParams);
</script>

<template>
  <VCard>
    <VCardText>
      <VRow justify="space-between">
        <VCol md="4">
          <VRow align="center">
            <VCol cols="auto">
              <VSelect
                v-model="formParams.perPage"
                style="min-width: 100px;"
                :items="perPageList"
                hide-details
                @update:model-value="handleSearch({page: 1})"
              >
              </VSelect>
            </VCol>
            <VCol>
              entries per page
            </VCol>
          </VRow>
        </VCol>
        <VCol md="4">
          <VTextField
            v-model="formParams.query"
            placeholder="Search"
            type="text"
            @update:model-value="handleSearch({page: 1})"
          />
        </VCol>
      </VRow>
    </VCardText>
    <VTable class="table mb-0 border-top dt-table">
      <thead class="table-light">
        <tr>
          <th
            v-for="(header, index) in headers"
            :key="index"
            :class="{ 'sortable': header.sortable, 'sort-active': formParams.sort == header.key }"
            :style="header?.headerStyle"
            @click="handleSort(header)"
          >
            <div
              class="data-header"
              :class="{
                'd-flex justify-content-end flex-grow-1' : header?.alignHeader === 'right'
              }"
              :style="header?.headerContentStyle"
            >
              <slot
                :name="`header.${header.key}`"
                :title="header.title"
              >
                {{ header.title }}
              </slot>
              <span
                v-if="header.sortable && header.key == formParams.sort"
                class="sorter"
              >
                <FontAwesomeIcon
                  v-if="formParams.order == 'desc'"
                  :icon="['fal', 'arrow-up']"
                />
                <FontAwesomeIcon
                  v-if="formParams.order == 'asc'"
                  :icon="['fal', 'arrow-down']"
                />
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="data?.length <= 0">
          <td
            class="text-center"
            colspan="999999"
          >
            No item found
          </td>
        </tr>
        <tr
          v-for="(item, itemIndex) in data"
          :key="itemIndex"
          class="dt-row"
        >
          <td
            v-for="(header, index) in headers"
            :key="index"
            :style="header?.itemStyle"
            class="dt-content"
          >
            <span class="dt-mobile-header">{{ header.title }}</span>
            <div class="dt-cell">
              <slot 
                :item="item"
                :name="`item.${header.key}`"
              >
                {{ item?.[header.key] }}
              </slot>
            </div>
          </td>
        </tr>
      </tbody>
    </VTable>
    <VCardText>
      <VRow>
        <VCol>
          {{ pagination.entries }}
        </VCol>
        <VCol>
          <VPagination :length="2" v-model="pagination.currentPage" @update:model-value="($event) => handleSearch({page: $event})" />
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.sortable {
    cursor: pointer;
}
.data-header {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.sort-active {
    background-color: rgba(0,0,0,0.05);
}
th {
    text-transform: uppercase !important;
    font-size: 0.8rem;
}
td, th {
    white-space: pre-wrap;
    padding: 0.5rem 0.75rem !important;
}

.dt-table {
  .dt-mobile-header {
    display: none;
  }
  @media screen and (max-width: 767px) {
    border-top: unset !important;
    thead {
      display: none;
    }
    .dt-mobile-header {
      font-size: 14px;
      display: block;
      text-align: left !important;
    }
    tbody {
      display: flex;
      flex-direction: column;
      row-gap: 1rem;
      border-width: 0px;
    }
    .dt-row {
      display: block;
      border-radius: 1rem;
      background-color: #fff;
    }
    .dt-content {
      display: grid;
      grid-template-columns: 25% 1fr;
      width: 100% !important;
    }
  }
}

@media screen and (max-width: 767px) { 
  .card {
    background-color: transparent;
    box-shadow: unset;
  }  
  .card-body {
    border: unset !important;
    background-color: #fff;
    border-radius: 1rem;
    margin-bottom: 1rem;
    margin-top: 1rem;
    
  }
}
</style>