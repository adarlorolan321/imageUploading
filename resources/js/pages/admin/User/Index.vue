<!-- eslint-disable vue/component-name-in-template-casing -->
<script setup>
import { useCrud } from '@core/composable/useCrud';
import { usePage, Head, Link, useForm, router } from '@inertiajs/vue3';
import Layout from '@/layouts/default.vue';
import AppToast from '@core/components/AppToast.vue';
import moment from 'moment';
import { useToastStore } from '@/store/useToastStore';

const { openToast } = useToastStore();
const { props } = usePage();
const perPage = props.data.meta.per_page;
const sort = 'first_name';
const order = 'asc';

const formObject = {
    name: null,
    code: null,
};

const user = computed(() => {
    return usePage().props.auth.user;
});

const routeName = 'admin.users.index';

const fields = [
//   {
//     label: 'ID',
//     field: 'id',
//     minWidth: '100px',
//     sorting: true,
//   },
//   {
//     label: 'Email',
//     field: 'email',
//     minWidth: '100px',
//     sorting: true,
//   },

    {
        label: 'First Name',
        field: 'first_name',
        width: '40%',
        sorting: true
    },
    {
        label: 'Last Name',
        field: 'last_name',
        width: '40%',
        sorting: true
    }

    // {
    //   label: 'Status',
    //   field: 'status',
    //   minWidth: '100px',
    //   sorting: true,
    // },
];

let {
    paginatedData,
    createPromise,
    updatePromise,
    deletePromise,
    serverQuery,
    handleServerQuery,
    handlePageChange
} = useCrud({ formObject, routeName, perPage, extraProps: { sort, order } });

const paginateTable = pageIndex => {
    handlePageChange(pageIndex);
};

const handlePerPageChange = value => {
    handleServerQuery('perPage', value);
};

const handleSearchChange = value => {
    handleServerQuery('query', value);
};

const formDialog = ref(false);
const deleteDialog = ref(false);
const isSnackbarShown = ref(false);
const message = ref(null);
const formState = ref('create');

const idToDelete = ref(null);
const handleDelete = () => {
    router.delete(route('admin.users.destroy', idToDelete.value), {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
            router.reload();
            openToast({
                color: 'error',
                message: 'Record deleted'
            });
            deleteDialog.value = false;
        }
    });
};
// const formDialog = () => {

// }

const form = useForm({
    id: null,
    email: null,
    first_name: null,
    last_name: null
});

const handleEdit = (item) => {
    formState.value = 'update';
    form.reset();
    form.clearErrors();
    form.id = item.id;
    form.email = item.email;
    form.first_name = item.first_name;
    form.last_name = item.last_name;
    formDialog.value = true;
};

const handleCreate = (item) => {
    formState.value = 'create';
    form.reset();
    form.clearErrors();
    formDialog.value = true;
};

const handleDialogDelete = (item) => {
    idToDelete.value = item.id;
    deleteDialog.value = true;
};

const submit = async () => {
    if (formState.value == 'update' && form.id) {
        form.patch(route('admin.users.update', form.id), {
            onSuccess: () => {
                router.reload();
                form.reset();
                formDialog.value = false;
                formState.value = 'create';
                openToast({
                    color: 'success',
                    message: 'Record saved'
                });

            }
        });
    } else {
        form.post(route('admin.users.store'), {
            onSuccess: () => {
                form.reset();
                router.reload();
                formDialog.value = false;
                formState.value = 'create';
                openToast({
                    color: 'success',
                    message: 'Record saved'
                });
            }
        });
    }
};
</script>

<script>
export default {
    name: 'Dashboard',
    layout: (h, page) => h(Layout, [page])
};
</script>

<template>
    <Head title='User Management'></Head>

    <AppToast />
    <VSnackbar
        v-model='isSnackbarShown'
        timeout='2000'
    >
        {{ message }}
    </VSnackbar>


    <VDialog v-model='deleteDialog' width='450px'>
        <VCard>
            <VCardText>
                <h1 class='text-h5 text-center mt-2'>Are you sure?</h1>
                <p class='text-center mb-2'>You won't be able to revert this!</p>
                <VRow justify='center' class='mt-2' no-gutters>
                    <VCol cols='auto'>
                        <VBtn color='primary' class='mt-2 mr-2' @click='handleDelete'>Yes, Delete it!</VBtn>
                    </VCol>
                    <VCol cols='auto'>
                        <VBtn color='error' class='mt-2' @click='deleteDialog = false'>Cancel</VBtn>
                    </VCol>
                </VRow>
            </VCardText>
        </VCard>
    </VDialog>
    <VCard>
        <VCardItem>
            <template #append>
                <VBtn prepend-icon='tabler-plus' @click='handleCreate'> Create User</VBtn>
                <VDialog v-model='formDialog' max-width='700'>
                    <VCard class='auth-card pa-4'>
                        <VCardText class='pt-2'>
                            <VBtn
                                icon size='x-medium' color='default' variant='text' class='float-end'
                                @click.prevent='formDialog = false'
                            >
                                <VIcon size='x-large' icon='tabler-x' color='primary' />
                            </VBtn>
                            <h3 class='text-h5 font-weight-semibold mb-1'>{{ formState == 'create' ? 'Create' : 'Update'
                                }} User</h3>
                        </VCardText>
                        <VCardText>
                            <VForm>
                                <VTextField
                                    class='mb-4'
                                    label='First Name *'
                                    :error='form.errors.first_name ? true : false'
                                    :error-messages='form.errors.first_name'
                                    @update:model-value="form.clearErrors('first_name')"
                                    v-model='form.first_name'
                                />
                                <VTextField
                                    class='mb-4'
                                    label='Last Name *'
                                    v-model='form.last_name'
                                    :error='form.errors.last_name ? true : false'
                                    :error-messages='form.errors.last_name'
                                    @update:model-value="form.clearErrors('last_name')"
                                />
                                <VTextField
                                    class='mb-4'
                                    label='Email *'
                                    v-model='form.email'
                                    :error='form.errors.email ? true : false'
                                    :error-messages='form.errors.email'
                                    @update:model-value="form.clearErrors('email')"
                                />
                            </VForm>
                        </VCardText>
                        <VCardText>
                            <VRow justify='end'>
                                <VCol cols='auto'>
                                    <VBtn class='mt-2' :disabled='form.processing' @click='submit'>
                                        {{ formState == 'create' ? 'Submit' : 'Save/Update' }}
                                    </VBtn>
                                </VCol>
                            </VRow>
                        </VCardText>
                    </VCard>
                </VDialog>
            </template>
            <VCardTitle>Admin Users</VCardTitle>
        </VCardItem>

        <VCardText class='d-flex align-center flex-wrap gap-4'>
            <!-- 👉 Rows per page -->
            <div class='d-flex align-center' style='width: 135px'>
                <span class='text-no-wrap me-3'>Show:</span>
                <VSelect
                    v-model='serverQuery.perPage'
                    density='compact'
                    :items='[5, 10, 20, 50, 100]'
                    @update:model-value='handlePerPageChange'
                />
            </div>
            <VSpacer />
            <div class='d-flex align-center flex-wrap gap-4'>
                <!-- 👉 Search  -->
                <div class='search-bar'>
                    <VTextField
                        v-model='serverQuery.query'
                        label='Search'
                        placeholder='Search'
                        density='compact'
                        single-line
                        @update:model-value='handleSearchChange'
                    />
                </div>
            </div>
        </VCardText>

        <VDivider />

        <!-- SECTION Table -->
        <VTable class='invoice-list-table'>
            <!-- 👉 Table head -->
            <thead class='table-light' style='min-width: 100px'>
            <tr>
                <TableHeader
                    :key='key'
                    v-for='(field, key) in fields'
                    :style='`min-width: ${field.minWidth}; width: ${field.width}`'
                    @click="handleServerQuery('sort', field.field, field.sorting)"
                    :serverQuery='serverQuery'
                    :serverQueryKey='field.field'
                    :sorting='field.sorting'
                >
                    {{ field.label }}
                </TableHeader>
                <th class='text-uppercase' style='width:6%;'>Actions</th>
            </tr>
            </thead>
            <tbody class='table-border-bottom-0'>
            <tr v-for='tableData in paginatedData.data' :key='tableData'>
                <!-- <td>
                  {{ tableData.id }}
                </td>  -->
                <td>
                    {{ tableData.first_name }}
                </td>
                <td>
                    {{ tableData.last_name }}
                </td>
                <!-- <td>
                  {{ tableData.email }}
                </td>  -->
                <!--
              <td>
                  {{ tableData.status }}
                </td>
      -->
                <td>
                    <div class='d-flex gap-2 justify-end'>
                        <VBtn icon size='x-small' color='default' variant='text' @click='handleEdit(tableData)'>
                            <VTooltip
                                activator='parent'
                                location='top'
                                transition='scale-transition'
                            >
                                Edit
                            </VTooltip>
                            <VIcon size='22' icon='mdi-pencil' />
                        </VBtn>
                        <VBtn v-if='user.id != tableData.id && tableData.id != 1' icon size='x-small' color='error'
                              variant='text' @click='handleDialogDelete(tableData)'>
                            <VTooltip
                                activator='parent'
                                location='top'
                                transition='scale-transition'
                            >
                                Delete
                            </VTooltip>
                            <VIcon size='22' icon='mdi-trash-can' />
                        </VBtn>
                    </div>
                </td>
            </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show='!paginatedData.data.length'>
            <tr>
                <td colspan='8' class='text-center text-body-1'>No data available</td>
            </tr>
            </tfoot>
        </VTable>
        <!-- !SECTION -->

        <VDivider />

        <!-- SECTION Pagination -->
        <VCardText class='d-flex align-center flex-wrap gap-4 py-3'>
            <!-- 👉 Pagination meta -->
            <span class='text-sm text-disabled' v-if='paginatedData.meta.total'>
        {{ `Showing ${paginatedData.meta.from} to ${paginatedData.meta.to} of ${paginatedData.meta.total} entries` }}
      </span>

            <VSpacer />

            <!-- 👉 Pagination -->
            <VPagination
                v-model='paginatedData.meta.current_page'
                size='small'
                :total-visible='5'
                :length='paginatedData.meta.last_page'
                @update:model-value='paginateTable'
                @next='paginateTable'
                @prev='paginateTable'
            />
        </VCardText>
        <!-- !SECTION -->
    </VCard>
</template>
