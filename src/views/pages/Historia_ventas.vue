<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import ApiService from '@/service/ApiService';

const toast = useToast();
const api = new ApiService();
const products = ref([]);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref([]);
const dt = ref(null);
const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
const submitted = ref(false);

const fetchData = async () => {
    try {
        const dataC = await api.get('historia_ventas');
        products.value = dataC; // Assuming dataC is an array of products
    } catch (error) {
        console.error('Error fetching data:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch data', life: 3000 });
    }
};

onMounted(() => {
    fetchData();
});

const exportCSV = () => {
    dt.value.exportCSV();
};

const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};

const deleteSelectedProducts = async () => {
    try {
        const idsToDelete = selectedProducts.value.map(product => product.id);
        await api.delete('historia_ventas', { ids: idsToDelete });
        products.value = products.value.filter(product => !idsToDelete.includes(product.id));
        deleteProductsDialog.value = false;
        selectedProducts.value = [];
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Eliminado', life: 3000 });
    } catch (error) {
        console.error('Error deleting products:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete products', life: 3000 });
    }
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
    if (product.value.id_producto && product.value.nombre && product.value.total) {
        try {
            if (product.value.id) {
                await api.put(`historia_ventas/${product.value.id}`, product.value);
                const index = products.value.findIndex(p => p.id === product.value.id);
                products.value[index] = { ...product.value };
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Actualizadod', life: 3000 });
            } else {
                product.value.id = createId();
                await api.post('historia_ventas', product.value);
                products.value.push({ ...product.value });
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }
            productDialog.value = false;
            product.value = {};
        } catch (error) {
            console.error('Error saving product:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to save product', life: 3000 });
        }
    }
};

const createId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
};

const editProduct = (prod) => {
    product.value = { ...prod };
    productDialog.value = true;
};

const confirmDeleteProduct = (prod) => {
    product.value = { ...prod };
    deleteProductDialog.value = true;
};

const deleteProduct = async () => {
    try {
        await api.delete(`historia_ventas/${product.value.id}`);
        products.value = products.value.filter(val => val.id !== product.value.id);
        deleteProductDialog.value = false;
        product.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Eliminado', life: 3000 });
    } catch (error) {
        console.error('Error deleting product:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product', life: 3000 });
    }
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card surface-card shadow-2 border-round p-4">
                <Toolbar class="mb-4 surface-overlay shadow-2 border-round">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Agregar" icon="pi pi-plus" class="mr-2 p-button-success p-button-raised p-button-rounded" @click="openNew" />
                        </div>
                    </template>
                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="mr-2 inline-block p-button-rounded p-button-info" />
                        <Button label="Export" icon="pi pi-upload" class="p-button-help p-button-rounded p-button-raised" @click="exportCSV" />
                    </template>
                </Toolbar>
                <DataTable
                    ref="dt"
                    :value="products"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
                    class="p-datatable-gridlines"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 >HISTORIA VENTAS</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search"></i>
                                <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                            </span>
                        </div>
                    </template>
                    <Column selectionMode="multiple" headerStyle="width: 3rem" />
                    <Column field="id" header="ID" :sortable="true" />
                    <Column field="id_producto" header="ID Producto" :sortable="true" />
                    <Column field="nombre" header="Nombre" :sortable="true" />
                    <Column field="total" header="total" :sortable="true" />
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2 p-button-rounded p-button-success p-button-outlined" @click="editProduct(slotProps.data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-warning p-button-outlined" @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Historial de venta" :modal="true" class="p-fluid border-round shadow-2">
                    <div class="field">
                        <label for="id_producto">ID Producto</label>
                        <InputText id="id_producto" v-model.trim="product.id_producto" required autofocus :invalid="submitted && !product.id_producto" />
                        <small class="p-error" v-if="submitted && !product.id_producto">ID Producto es requerido.</small>
                    </div>
                    <div class="field">
                        <label for="nombre">Nombre</label>
                        <InputText id="nombre" v-model="product.nombre" required :invalid="submitted && !product.nombre" />
                        <small class="p-error" v-if="submitted && !product.nombre">Nombre es requerido.</small>
                    </div>
                    <div class="field">
                        <label for="total">Total</label>
                        <InputNumber id="total" v-model="product.total" required :invalid="submitted && !product.total" />
                        <small class="p-error" v-if="submitted && !product.total">Total es requerida.</small>
                    </div>

                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
                        <Button label="Guardar" icon="pi pi-check" class="p-button-text p-button-success" @click="saveProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true" class="p-fluid border-round shadow-2">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">¿Está seguro de que quiere eliminar <b>{{ product.nombre }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductDialog = false" />
                        <Button label="Sí" icon="pi pi-check" class="p-button-text p-button-danger" @click="deleteProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true" class="p-fluid border-round shadow-2">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>¿Está seguro de que quiere eliminar los productos seleccionados?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteProductsDialog = false" />
                        <Button label="Sí" icon="pi pi-check" class="p-button-text p-button-danger" @click="deleteSelectedProducts" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
