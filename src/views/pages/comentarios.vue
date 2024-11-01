<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import ApiService from '@/service/ApiService';
import { FilterMatchMode } from 'primevue/api';

import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputNumber from 'primevue/inputnumber';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';

import FileUpload from 'primevue/fileupload';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

const toast = useToast();
const api = new ApiService();
const comments = ref([]);
const commentDialog = ref(false);
const deleteCommentDialog = ref(false);
const deleteCommentsDialog = ref(false);
const comment = ref({});
const selectedComments = ref([]);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

const data = ref([]);

const fetchData = async () => {
    try {
        const dataC = await api.get('comentarios');
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
    deleteCommentsDialog.value = true;
};

const deleteSelectedComments = () => {
    comments.value = comments.value.filter(val => !selectedComments.value.includes(val));
    deleteCommentsDialog.value = false;
    selectedComments.value = [];
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Comments Eliminado', life: 3000 });
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const openNew = () => {
    comment.value = {};
    submitted.value = false;
    commentDialog.value = true;
};

const hideDialog = () => {
    commentDialog.value = false;
    submitted.value = false;
};

const saveComment = async () => {
    submitted.value = true;

    // Validar campos
    if (comment.value.productos_id  && comment.value.nombre && comment.value.comentario) {
        try {
            let response;

            if (comment.value.id) {
                response = await api.put(`comentarios/${comment.value.id}`, comment.value);
                const index = comments.value.findIndex(c => c.id === comment.value.id);
                if (index !== -1) {
                    comments.value[index] = response.data;
                }
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Comment Actualizadod', life: 3000 });
            } else {
                response = await api.post('comentarios', comment.value);
                comments.value.push(response.data);
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Comment Created', life: 3000 });
            }

            commentDialog.value = false;
            comment.value = {}; // Reset the comment object
            fetchData(); // Refresh the data after saving
        } catch (error) {
            console.error('Error saving comment:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error saving comment', life: 3000 });
        }
    } else {
        // Mostrar un mensaje de error si algún campo está vacío
        toast.add({ severity: 'warn', summary: 'Validation Error', detail: 'All fields are required', life: 3000 });
    }

    
    if (comment.value.ofertas_id  && comment.value.nombre && comment.value.comentario) {
        try {
            let response;

            if (comment.value.id) {
                response = await api.put(`comentarios/${comment.value.id}`, comment.value);
                const index = comments.value.findIndex(c => c.id === comment.value.id);
                if (index !== -1) {
                    comments.value[index] = response.data;
                }
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Comment Actualizadod', life: 3000 });
            } else {
                response = await api.post('comentarios', comment.value);
                comments.value.push(response.data);
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Comment Created', life: 3000 });
            }

            commentDialog.value = false;
            comment.value = {}; // Reset the comment object
            fetchData(); // Refresh the data after saving
        } catch (error) {
            console.error('Error saving comment:', error);
            toast.add({ severity: 'error', summary: 'Error', detail: 'Error saving comment', life: 3000 });
        }
    } else {
        // Mostrar un mensaje de error si algún campo está vacío
        toast.add({ severity: 'warn', summary: 'Validation Error', detail: 'All fields are required', life: 3000 });
    }
};

const createId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
};

const editComment = (comm) => {
    comment.value = { ...comm };
    commentDialog.value = true;
};

const confirmDeleteComment = (comm) => {
    comment.value = comm;
    deleteCommentDialog.value = true;
};

const deleteComment = async () => {
    try {
        await api.delete(`comentarios/${comment.value.id}`);
        comments.value = comments.value.filter(val => val.id !== comment.value.id);
        deleteCommentDialog.value = false;
        comment.value = {};
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Comentario Eliminado', life: 3000 });
        fetchData(); // Refresh the data after deleting
    } catch (error) {
        console.error('Error deleting comment:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error deleting comment', life: 3000 });
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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} comments"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">COMENTARIOS PRODUCTOS</h5>
                            <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                <InputIcon class="pi pi-search" />
                                <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Search..." />
                            </IconField>
                        </div>
                    </template>

                    <Column field="productos_id" header="ID Producto" :sortable="true" />
                    
                    <Column field="nombre" header="Nombre" :sortable="true" />
                    <Column field="comentario" header="Comentario" :sortable="true" />

                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editComment(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteComment(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="commentDialog" :style="{ width: '450px' }" header="Comentarios" :modal="true" class="p-fluid">
                    <div class="field">
                        <label for="productos_id">ID Producto</label>
                        <InputText id="productos_id" v-model="comment.productos_id" required="true" />
                    </div>
                    
                    <div class="field">
                        <label for="nombre">Nombre</label>
                        <InputText id="nombre" v-model="comment.nombre" required="true" />
                    </div>
                    <div class="field">
                        <label for="comentario">Comentario</label>
                        <Textarea id="comentario" v-model="comment.comentario" required="true" />
                    </div>

                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                        <Button label="Guardar" icon="pi pi-check" text @click="saveComment" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteCommentDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>¿Estás seguro de que deseas eliminar el comentario con texto: <b>{{ comment.comentario }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteCommentDialog = false" />
                        <Button label="Sí" icon="pi pi-check" severity="danger" @click="deleteComment" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteCommentsDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>¿Estás seguro de que deseas eliminar los comentarios seleccionados?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteCommentsDialog = false" />
                        <Button label="Sí" icon="pi pi-check" severity="danger" @click="deleteSelectedComments" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>

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
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} comments"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">COMENTARIOS OFERTAS</h5>
                            <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                <InputIcon class="pi pi-search" />
                                <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Search..." />
                            </IconField>
                        </div>
                    </template>

                    
                    <Column field="ofertas_id" header="ID Ofertas" :sortable="true" />
                    <Column field="nombre" header="Nombre" :sortable="true" />
                    <Column field="comentario" header="Comentario" :sortable="true" />

                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editComment(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteComment(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="commentDialog" :style="{ width: '450px' }" header="Comentarios" :modal="true" class="p-fluid">
                    
                    <div class="field">
                        <label for="ofertas_id">ID Ofertas</label>
                        <InputText id="productos_id" v-model="comment.productos_id" required="true" />
                    </div>
                    <div class="field">
                        <label for="nombre">Nombre</label>
                        <InputText id="nombre" v-model="comment.nombre" required="true" />
                    </div>
                    <div class="field">
                        <label for="comentario">Comentario</label>
                        <Textarea id="comentario" v-model="comment.comentario" required="true" />
                    </div>

                    <template #footer>
                        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
                        <Button label="Guardar" icon="pi pi-check" text @click="saveComment" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteCommentDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>¿Estás seguro de que deseas eliminar el comentario con texto: <b>{{ comment.comentario }}</b>?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteCommentDialog = false" />
                        <Button label="Sí" icon="pi pi-check" severity="danger" @click="deleteComment" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteCommentsDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>¿Estás seguro de que deseas eliminar los comentarios seleccionados?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteCommentsDialog = false" />
                        <Button label="Sí" icon="pi pi-check" severity="danger" @click="deleteSelectedComments" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Agrega tus estilos aquí */
</style>