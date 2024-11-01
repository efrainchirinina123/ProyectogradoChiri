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
import Imagen from './imagen.vue';

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
const selectedImage = ref(null); 

const fetchData = async () => {
    try {
        const dataC = await api.get('ofertas');
       
        products.value = dataC;
        console.log(dataC);
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
    selectedImage.value = null;
    submitted.value = false;
    productDialog.value = true;
};

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
    imageUrl.value = null;
    selectedImage.value = null;
};

const saveProduct = async () => {
    submitted.value = true;

    if (product.value.nombre.trim() && product.value.descripcion.trim()) {
        const _product = { ...product.value };

        try {
            if (selectedImage.value) {
                const imageResponse = await api.createImage(await convertToBase64(selectedImage.value));
                _product.imagen = imageResponse.id; 
            } else {
                delete _product.imagen; 
            }

            if (product.value.id) {
                const index = findIndexById(product.value.id);
                products.value[index] = _product;
                await api.put(`ofertas/${product.value.id}`, _product);
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'ofertas Actualizado', life: 3000 });
            } else {
                products.value.push(_product);
                await api.post('ofertas', _product);
                toast.add({ severity: 'success', summary: 'Éxito', detail: 'ofertas Creado', life: 3000 });
            }

            productDialog.value = false;
            fetchData(); 
        } catch (error) {
            console.error(error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error al guardar el ofertas', life: 3000 });
        }
    }
};

const editProduct = (productData) => {
    product.value = { ...productData };
    imageUrl.value = null;
    selectedImage.value = null;
    productDialog.value = true;
};

const confirmDeleteProduct = (productData) => {
    product.value = productData;
    deleteProductDialog.value = true;  
};

const deleteProduct = async () => {
    try {
        await api.delete(`ofertas/${product.value.id}`);
        products.value = products.value.filter((p) => p.id !== product.value.id);
        deleteProductDialog.value = false;  
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'ofertas Eliminado', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el ofertas', life: 3000 });
    }
};

const findIndexById = (id) => {
    return products.value.findIndex((p) => p.id === id);
};



const onImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedImage.value = file;
        imageUrl.value = URL.createObjectURL(file); 
    }
};

const exportCSV = () => {
};

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]); 
        reader.onerror = (error) => reject(error);
    });
};
</script>
<script>
export default {
    methods: {
        getImage(imageId) {
            const imageUrl = imageId ? `https://serverfilesdev.esam.edu.bo/v1/files/${imageId}` : 'default_image_path';
            console.log(`URL de la imagen: ${imageUrl}`); // Verifica la URL generada
            return imageUrl;
        }
    }
};
</script>
<template>
    <div class="grid">
        <div class="col-12">
            <div class="card surface-card shadow-2 border-round p-4">
                <Toolbar class="mb-4 surface-overlay shadow-2 border-round">
                    <template v-slot:start>
                        <Button label="Agregar" icon="pi pi-plus" class="mr-2 p-button-success p-button-raised p-button-rounded" @click="openNew" />
                    </template>
                    <template v-slot:end>
                        <FileUpload
                            mode="basic"
                            accept="image/*"
                            :maxFileSize="1000000"
                            label="Importar"
                            chooseLabel="Elegir"
                            class="mr-2 inline-block p-button-rounded p-button-info"
                        />
                        <Button label="Exportar" icon="pi pi-upload" class="p-button-help p-button-rounded p-button-raised" @click="exportCSV" />
                    </template>
                </Toolbar>

                <DataTable
                    ref="dt"
                    :value="products"
                    dataKey="id"
                    :paginator="true"
                    :rows="10"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} ofertas"
                    class="p-datatable-gridlines rounded-table"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5>ofertas</h5>
                            <span class="block mt-2 md:mt-0 p-input-icon-left">
                                <i class="pi pi-search"></i>
                                <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                            </span>
                        </div>
                    </template>
                    <Column field="id" header="ID" :sortable="true" />
                    <template>
                        <div>
                            <Column field="imagen" header="Imagen" :sortable="false">
                                <template #body="{ data }">
                                    <Imagen :path=data.imagen></Imagen>
                                   
                                </template>
                            </Column>
                        </div>
                    </template>
                    
                   
                    
                 
                    
                    <Column field="nombre" header="Nombre" :sortable="true" />
                    <Column field="descripcion" header="Descripción" :sortable="true" />
                    <Column field="precioantes" header="Precioantes" :sortable="true">
                        <template #body="{ data }">
                            <InputNumber v-model="data.precioantes" mode="currency" currency="BOB" :disabled="true" />
                        </template>
                    </Column>
                    <Column field="precioahora" header="Precioahora" :sortable="true">
                        <template #body="{ data }">
                            <InputNumber v-model="data.precioahora" mode="currency" currency="BOB" :disabled="true" />
                        </template>
                    </Column>
                    <Column header="Acciones" :sortable="false">
                        <template #body="{ data }">
                            <Button icon="pi pi-pencil" class="p-button-rounded p-button-success mr-2" @click="editProduct(data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>

    <Dialog header="Detalles del ofertas" :visible="productDialog" :modal="true" @hide="hideDialog" class="product-dialog">
        <div class="dialog-content">

            <div class="field image-upload">
                <label for="imagen" class="field-label"></label>
                <div class="file-upload-container">
                    <input type="file" accept="image/*" @change="onImageSelect" class="file-input" id="file-input" />
                    <label for="file-input" class="custom-upload-button" v-if="!imageUrl">
                        <i class="pi pi-upload" style="font-size: 15px;"></i>
                    </label>
                </div>
                <div class="image-preview-container" v-if="imageUrl">
                    <img :src="imageUrl" alt="Vista previa" class="image-preview" />
                    <button class="delete-icon" @click="ideDialo">×</button>
                </div>
                <div class="upload-placeholder" v-if="!imageUrl">
                    <span class="upload-text">Sube una imagen (máx. 150px de ancho)</span>
                </div>
            </div>

            <div class="field">
                <label for="nombre" class="field-label">Nombre</label>
                <InputText id="nombre" v-model="product.nombre" required autofocus class="input-text" />
            </div>
    
            <div class="field">
                <label for="descripcion" class="field-label">Descripción</label>
                <InputTextarea id="descripcion" v-model="product.descripcion" rows="3" required class="input-textarea" />
            </div>
    
            <div class="field">
                <label for="precioantes" class="field-label">Precioantes</label>
                <InputNumber v-model="product.precioantes" mode="currency" currency="BOB" required class="input-number" />
            </div>
            <div class="field">
                <label for="precioahora" class="field-label">Precioahora</label>
                <InputNumber v-model="product.precioahora" mode="currency" currency="BOB" required class="input-number" />
            </div>
    
    
    
            <div class="field button-field">
                <Button label="Guardar" icon="pi pi-check" @click="saveProduct" class="save-button" />
                <Button label="Cancelar" icon="pi pi-times" @click="hideDialog" class="seve-button" />
            </div>
        </div>
    </Dialog>
    
 
    

    <ConfirmDialog :visible="deleteProductDialog" @hide="deleteProductDialog=false" message="¿Estás seguro de eliminar este ofertas?"
                   header="Confirmación" icon="pi pi-exclamation-triangle" accept="deleteProduct" />
</template>


<style scoped>
.product-dialog {
    border-radius: 20px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    background: linear-gradient(145deg, #f4f4f4, #eaeaea);
    transition: all 0.3s ease-in-out;
}

.dialog-content {
    padding: 30px;
}

.field {
    margin-bottom: 1.5rem;
}

.field-label {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
    font-size: 1rem;
}

.input-text,
.input-textarea,
.input-number {
    width: 100%;
    padding: 0.75rem 1rem;
    border: none;
    border-radius: 10px;
    background: #ffffff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
}

.input-text:focus,
.input-textarea:focus,
.input-number:focus {
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
}

.image-upload {
    display: flex;
    flex-direction: column;
    align-items: center; /* Centering the content */
}

.file-upload-container {
    display: flex;
    align-items: center;
    position: relative;
}

.file-input {
    display: none; /* Hide the default file input */
}

.custom-upload-button {
    background-color: #007bff; /* Primary color for the button */
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.2s;
    font-weight: 500;
    text-align: center;
}

.custom-upload-button:hover {
    background-color: #0056b3; /* Darker blue on hover */
    transform: translateY(-2px);
}

.image-preview-container {
    width: 150px; /* Fixed width for image preview */
    height: 150px; /* Fixed height for image preview */
    border-radius: 10px;
    overflow: hidden;
    margin-top: 0.5rem;
    position: relative;
    background: #f7f7f7; /* Light gray background for the preview */
    display: flex;
    justify-content: center;
    align-items: center;
}

.image-preview {
    width: 100%; 
    height: 100%;
    object-fit: cover; /* Maintain aspect ratio and fill */
}

.delete-icon {
    position: absolute;
    top: 5px; /* Positioning at the top-right corner */
    right: 5px; /* Positioning at the right edge */
    background: transparent;
    border: none;
    color: red; /* Color for the delete icon */
    font-size: 24px; /* Size of the delete icon */
    cursor: pointer;
    transition: color 0.3s;
}

.delete-icon:hover {
    color: darkred; /* Darker color on hover */
}

.upload-placeholder {
    width: 150px; /* Match placeholder width */
    height: 150px; /* Match placeholder height */
    border: 2px dashed #007bff; /* Dashed blue border for the placeholder */
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.5rem;
    background: #eaeaea; /* Light background for the placeholder */
    color: #007bff; /* Text color */
    font-weight: 500; /* Bold text */
    text-align: center; /* Center text */
    transition: background 0.3s;
}

.upload-placeholder:hover {
    background: #d6e8ff; /* Slightly darker on hover */
}

.button-field {
    display: flex;
    justify-content: flex-end;
}

.save-button {
    background-color: #007bff; /* Primary color for Save button */
    color: white;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 10px;
    font-weight: 500;
    transition: background-color 0.3s, transform 0.2s;
}

.save-button:hover {
    background-color: #0056b3; /* Darker blue on hover */
    transform: translateY(-2px);
}
</style>