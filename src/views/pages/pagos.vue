<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import ApiService from '@/service/ApiService';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';

const toast = useToast();
const api = new ApiService();
const products = ref([]);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref([]);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

const data = ref([]);
const fetchData = async () => {
    try {
        const dataC = await api.get('pagos');
        data.value = dataC;
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

const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};

const deleteSelectedProducts = () => {
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
    deleteProductsDialog.value = false;
    selectedProducts.value = [];
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Eliminado', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: 'contains' }
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
    if (product.value.metodopago && product.value.metodopago.trim()) {
        try {
            let response;
            if (product.value.id) {
                response = await api.put(`pagos/${product.value.id}`, product.value);
                const index = products.value.findIndex(p => p.id === product.value.id);
                products.value[index] = response.data;
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Actualizadod', life: 3000 });
            } else {
                product.value.id = createId();
                response = await api.post('pagos', product.value);
                products.value.push(response.data);
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }
            productDialog.value = false;
            product.value = {};  // Reset the product object
            fetchData(); // Refresh the data after saving
        } catch (error) {
            console.error('Error saving product:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error saving product', life: 3000 });
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
    product.value = prod;
    deleteProductDialog.value = true;
};

const deleteProduct = async () => {
    try {
        await api.delete(`pagos/${product.value.id}`);
        products.value = products.value.filter(val => val.id !== product.value.id);
        deleteProductDialog.value = false;
        product.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Eliminado', life: 3000 });
        fetchData(); // Refresh the data after deleting
    } catch (error) {
        console.error('Error deleting product:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error deleting product', life: 3000 });
    }
};

// Payment methods for the dropdown
const paymentMethods = [
    { label: 'PayPal', value: 'PayPal' },
    { label: 'Tarjeta de credito', value: 'Tarjeta de credito' },
    { label: 'Transferencia', value: 'Transferencia' },
    { label: 'Efectivo', value: 'Efectivo' }
];
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
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} pagos"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">PAGOS</h5>
                            <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                <InputIcon class="pi pi-search" />
                                <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Buscar..." />
                            </IconField>
                        </div>
                    </template>

                    <Column field="id" header="ID" :sortable="true" />
                    <Column field="reciboId" header="Recibo ID" :sortable="true" />
                    <Column field="monto" header="Monto (Bs)" :sortable="true" />
                    <Column field="metodopago" header="Método de Pago" :sortable="true" />

                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editProduct(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Método de Pago" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="metodopago">Método de Pago</label>
                        <Dropdown id="metodopago" v-model="product.metodopago" :options="paymentMethods" optionLabel="label" optionValue="value" placeholder="Seleccione el método de pago" required :invalid="submitted && !product.metodopago" />
                        <small class="p-invalid" v-if="submitted && !product.metodopago">Método de Pago es requerido.</small>
                    </div>
                    <div class="field">
                        <label for="reciboId">ID Recibo</label>
                        <InputText id="reciboId" v-model="product.reciboId" required="true" />
                    </div>
                    <div class="field">
                        <label for="monto">Monto (Bs)</label>
                        <InputNumber id="monto" v-model="product.monto" mode="currency" currency="BOB" locale="es-BO" :minFractionDigits="2" :maxFractionDigits="2" required="true" />
                    </div>

                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" text="" @click="hideDialog" />
                        <Button label="Guardar" icon="pi pi-check" text="" @click="saveProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductDialog" header="Confirmar" modal footer="footer" :style="{ width: '350px' }">
                    <div class="flex align-items-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>¿Está seguro de que desea eliminar el producto?</span>
                    </div>
                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" text="" @click="hideDialog" />
                        <Button label="Eliminar" icon="pi pi-check" class="p-button-danger" @click="deleteProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductsDialog" header="Confirmar" modal footer="footer" :style="{ width: '350px' }">
                    <div class="flex align-items-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>¿Está seguro de que desea eliminar los productos seleccionados?</span>
                    </div>
                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" text="" @click="hideDialog" />
                        <Button label="Eliminar" icon="pi pi-check" class="p-button-danger" @click="deleteSelectedProducts" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
