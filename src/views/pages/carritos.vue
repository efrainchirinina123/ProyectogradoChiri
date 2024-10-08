<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import ApiService from '@/service/ApiService';

const toast = useToast();
const api = new ApiService();
const data = ref([]);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref([]);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

const fetchData = async () => {
    try {
        const response = await api.get('carritos');
        data.value = response;
        console.log(response);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

onMounted(() => {
    fetchData();
});

onBeforeMount(() => {
    initFilters();
});

const exportCSV = () => {
    dt.value.exportCSV();
};

const deleteSelectedProducts = () => {
    data.value = data.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = [];
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Eliminado', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

const saveProduct = async () => {
    submitted.value = true;
    if (product.value.productos_id && product.value.nombreusuario && product.value.precio) {
        try {
            if (product.value.id) {
                // Update existing product
                const response = await api.put(`carritos/${product.value.id}`, product.value);
                console.log(response);
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Actualizadod', life: 3000 });
            } else {
                // Create new product
                const response = await api.post('carritos', product.value);
                console.log(response);
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }
            productDialog.value = false;
            product.value = {};
            await fetchData(); // Refresh data after save
        } catch (error) {
            console.error('Error saving product:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error saving product', life: 3000 });
        }
    }
};

const editProduct = (prod) => {
    product.value = { ...prod };
    productDialog.value = true;
};

const confirmDeleteProduct = (prod) => {
    product.value = prod;
    deleteProductDialog.value = true;
};

const deleteProduct = async () => {
    try {
        await api.delete(`carritos/${product.value.id}`);
        data.value = data.value.filter(val => val.id !== product.value.id);
        deleteProductDialog.value = false;
        product.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Eliminado', life: 3000 });
        await fetchData(); // Refresh data after delete
    } catch (error) {
        console.error('Error deleting product:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error deleting product', life: 3000 });
    }
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Agregar" icon="pi pi-plus" class="mr-2" severity="success" @click="openNew" />
                        </div>
                    </template>
                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block" />
                        <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)" />
                    </template>
                </Toolbar>
                <DataTable
                    ref="dt"
                    :value="data"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Carrito</h5>
                            <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                <InputIcon class="pi pi-search" />
                                <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Search..." />
                            </IconField>
                        </div>
                    </template>

                    <Column field="productos_id" header="ID Producto" :sortable="true" />
                    <Column field="nombreusuario" header="Nombre Usuario" :sortable="true" />
                    <Column field="precio" header="Precio" :sortable="true" />

                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editProduct(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Carrito" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="productos_id">ID Producto</label>
                        <InputText id="productos_id" v-model="product.productos_id" required autofocus :invalid="submitted && !product.productos_id" />
                        <small class="p-invalid" v-if="submitted && !product.productos_id">ID Producto is required.</small>
                    </div>
                    <div class="field">
                        <label for="nombreusuario">Nombre Usuario</label>
                        <InputText id="nombreusuario" v-model="product.nombreusuario" required :invalid="submitted && !product.nombreusuario" />
                        <small class="p-invalid" v-if="submitted && !product.nombreusuario">Nombre Usuario is required.</small>
                    </div>
                    <div class="field">
                        <label for="precio">Precio</label>
                        <InputNumber id="precio" v-model="product.precio" required :invalid="submitted && !product.precio" />
                        <small class="p-invalid" v-if="submitted && !product.precio">Precio is required.</small>
                    </div>
                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                        <Button label="Guardar" icon="pi pi-check" text @click="saveProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>¿Estás seguro de que deseas eliminar el producto <b>{{ product.productos_id }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
                        <Button label="Si" icon="pi pi-check" text @click="deleteProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>¿Estás seguro de que deseas eliminar los productos seleccionados?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Add your styles here */
</style>
