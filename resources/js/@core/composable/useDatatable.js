import { usePage, router } from '@inertiajs/vue3'
import { ref, computed, watch, onMounted } from "vue"
import { debounce } from 'lodash'

export function useDataTable(route, only = [], additionalParams = {}) {
    const perPageList = [5, 10, 25, 50, 100];

    const formParams = ref({
        query: null,
        sort: null,
        order: null,
        page: 1,
        perPage: 50,
        ...additionalParams,
    })

    const pageParams = computed(() => usePage().props.params)
    const data = computed(() => usePage().props.data.data);
    const pagination = computed(() => {
        return {
            entries: `Showing ${usePage().props.data.from??0} to ${usePage().props.data.to??0} of ${usePage().props.data.total} entries`,
            currentPage: usePage().props.data.current_page,
            firstPageUrl: usePage().props.data.first_page_url,
            lastPageUrl: usePage().props.data.last_page_url,
            total: usePage().props.data.last_page_url.total,
            last_page: usePage().props.data.last_page,
            
            links: usePage().props.data?.links.map((link) => {
                let label = link.label;
                if (link.label == '&laquo; Previous') {
                    label = 'Previous';
                }
                if (link.label == 'Next &raquo;') {
                    label = 'Next';
                }
                
                return {
                    ...link,
                    label: label,
                }
            }),
        }
    })

    const syncFormParams = () => {
        formParams.value = {
            ...formParams.value,
            ...pageParams.value,
        }
    }

    onMounted(() => {
       syncFormParams();
    })

    watch(pageParams, () => {
       syncFormParams();
    })

    const handleSearch = debounce((additionalParams = {}) => {
        router.get(route, { ...formParams.value, ...additionalParams }, {
            only: only,
            preserveState: true,
        })
    }, 1000);
    
    const handleSort = function(header) {
        if (header.sortable) {
            if (header.key === formParams.value.sort) {
                if(formParams.value.order == 'desc') {
                    formParams.value.sort = null;
                    formParams.value.order = null;
                }else {
                    formParams.value.order = formParams.value.order === 'asc' ? 'desc' : 'asc';
                }
            }
            else {
                formParams.value.sort = header.key;
                formParams.value.order = 'asc';
            }
        }
        handleSearch();
    }

    return {
        handleSearch,
        handleSort,
        data,
        formParams,
        perPageList,
        pagination,
    }

}