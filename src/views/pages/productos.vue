<template>
    <div class="grid">
        <div class="col-12">
            <div class="card surface-card shadow-2 border-round p-4">
                <Toolbar class="mb-4 surface-overlay shadow-2 border-round">
                    <template v-slot:start>
                        <Button label="Agregar" icon="pi pi-plus" class="mr-2 p-button-success p-button-raised p-button-rounded" @click="openNew" />
                    </template>
                    <template v-slot:end>
                        <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Importar" chooseLabel="Elegir" class="mr-2 inline-block p-button-rounded p-button-info" />
                        <Button label="Exportar" icon="pi pi-upload" class="p-button-help p-button-rounded p-button-raised" @click="exportCSV" />
                    </template>
                </Toolbar>

                <DataTable ref="dt" :value="products" dataKey="id" :paginator="true" :rows="10" :filters="filters" paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" :rowsPerPageOptions="[5, 10, 25]" currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos" class="p-datatable-gridlines rounded-table">
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5>PRODUCTOS</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search"></i>
                                <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                            </span>
                        </div>
                    </template>
                    <Column field="id" header="ID" :sortable="true" />
                    <Column field="imagen" header="Imagen" :sortable="false">
                        <template #body="{ data }">
                            <img :src="getImageSource(data.imagen)" alt="Imagen del producto" class="w-6 border-round shadow-2" v-if="data.imagen" />
                            <span v-else>Sin imagen</span>
                        </template>
                    </Column>
                    <Column field="nombre" header="Nombre" :sortable="true" />
                    <Column field="descripcion" header="Descripción" :sortable="true" />
                    <Column field="precio" header="Precio" :sortable="true">
                        <template #body="{ data }">
                            <InputNumber v-model="data.precio" mode="currency" currency="USD" :disabled="true" />
                        </template>
                    </Column>
                    <Column header="Acciones" :sortable="false">
                        <template #body="{ data }">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(data)" />
                            <Button icon="pi pi-trash" class="p-button-rounded p-button-danger" @click="confirmDeleteProduct(data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>

    <Dialog header="Detalles del Producto" :visible="productDialog" :modal="true" :style="{ width: '50vw' }" @hide="hideDialog">
        <div class="field">
            <label for="nombre">Nombre</label>
            <InputText id="nombre" v-model="product.nombre" required autofocus />
        </div>
        <div class="field">
            <label for="descripcion">Descripción</label>
            <InputTextarea id="descripcion" v-model="product.descripcion" required />
        </div>
        <div class="field">
            <label for="precio">Precio</label>
            <InputNumber id="precio" v-model="product.precio" mode="currency" currency="USD" required />
        </div>
        <div class="field">
            <label for="imagen">Imagen</label>
            <FileUpload mode="basic" accept="image/*" @upload="onImageUpload" />
            <img :src="imageUrl" v-if="imageUrl" alt="Preview" class="mt-2 w-6 border-round shadow-2" />
        </div>
        <div class="flex justify-content-end">
            <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
            <Button label="Guardar" icon="pi pi-check" class="p-button-text" @click="saveProduct" />
        </div>
    </Dialog>

    <ConfirmDialog header="Confirmación" message="¿Estás seguro de que deseas eliminar este producto?" :visible="deleteProductDialog" @confirm="deleteProduct" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import ApiService from '@/service/ApiService';
import InputTextarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
import ConfirmDialog from 'primevue/confirmdialog';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import FileUpload from 'primevue/fileupload';

const toast = useToast();
const api = new ApiService();
const products = ref([]);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const product = ref({});
const dt = ref(null);
const filters = ref({ global: { value: null } });
const submitted = ref(false);
const imageUrl = ref(null);

const fetchData = async () => {
    try {
        const dataC = await api.get('productos');
        products.value = dataC;
    } catch (error) {
        console.error('Error fetching data:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error fetching data', life: 3000 });
    }
};

let intervalId;

onMounted(() => {
    fetchData();
    intervalId = setInterval(fetchData, 60000);
});

onUnmounted(() => {
    clearInterval(intervalId);
});

const openNew = () => {
    product.value = {};
    imageUrl.value = null;
    submitted.value = false;
    productDialog.value = true;
};

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

const saveProduct = async () => {
    submitted.value = true;

    if (product.value.nombre.trim() && product.value.descripcion.trim()) {
        let _products = [...products.value];
        let _product = { ...product.value };

        if (product.value.id) {
            const index = findIndexById(product.value.id);
            _products[index] = _product;

            try {
                if (imageUrl.value) {
                    const imgId = await api.createImage(imageUrl.value);
                    _product.imagen = imgId;
                }

                await api.put(`productos/${product.value.id}`, _product);
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'Producto Actualizado', life: 3000 });
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar el producto', life: 3000 });
            }
        } else {
            if (imageUrl.value) {
                const imgId = await api.createImage(imageUrl.value);
                _product.imagen = imgId;
            } else {
                _product.imagen = 'default-image-id'; // Cambia esto según tu lógica
            }

            _products.push(_product);
            try {
                await api.post('productos', _product);
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'Producto Creado', life: 3000 });
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Error al crear el producto', life: 3000 });
            }
        }

        products.value = _products;
        productDialog.value = false;
    }
};

const editProduct = (productData) => {
    product.value = { ...productData };
    imageUrl.value = null;
    productDialog.value = true;
};

const confirmDeleteProduct = (productData) => {
    product.value = productData;
    deleteProductDialog.value = true;
};

const deleteProduct = async () => {
    try {
        await api.delete(`productos/${product.value.id}`);
        products.value = products.value.filter((p) => p.id !== product.value.id);
        deleteProductDialog.value = false;
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Producto Eliminado', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el producto', life: 3000 });
    }
};

const findIndexById = (id) => {
    return products.value.findIndex((p) => p.id === id);
};

const getImageSource = (imageId) => {
    // Retorna la URL de la imagen o la imagen predeterminada si no hay
    return imageId ? `path_to_your_image_service/${imageId}` : 'default_image_path';
};

const onImageUpload = (event) => {
    // Manejar la carga de la imagen y la vista previa
    if (event.files && event.files.length > 0) {
        imageUrl.value = URL.createObjectURL(event.files[0]);
    }
};

const exportCSV = () => {
    // Implementa la lógica para exportar a CSV
};

</script>

<style scoped>
/* Aquí puedes agregar estilos específicos para este componente */
</style>
