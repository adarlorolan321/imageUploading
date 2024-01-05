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
    <VCardText class="border-b">
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
        <VCol lg="3">
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
    <VCardText class="border-t">
      <VRow>
        <VCol>
          {{ pagination.entries }}
        </VCol>
        <VCol>
          <div>
            <VPagination :length="pagination.last_page" v-model="pagination.currentPage" @update:model-value="($event) => handleSearch({page: $event})" />
          </div>
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
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
}

.sort-active {
  background-color: rgb(0 0 0 / 5%);
}

th {
  font-size: 0.8rem;
  text-transform: uppercase !important;
}

td,
th {
  padding: 0.5rem 0.75rem !important;
  white-space: pre-wrap;
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
      display: block;
      font-size: 14px;
      text-align: left !important;
    }

    tbody {
      display: flex;
      flex-direction: column;
      border-width: 0;
      row-gap: 1rem;
    }

    .dt-row {
      display: block;
      border-radius: 1rem;
      background-color: #fff;
    }

    .dt-content {
      display: grid;
      width: 100% !important;
      grid-template-columns: 25% 1fr;
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
    border-radius: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
    background-color: #fff;
  }
}

:deep(.v-pagination__list) {
  justify-content: flex-end !important;
}
</style>