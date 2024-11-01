<script setup>
import { FilterMatchMode } from 'primevue/api';
import { ref, onMounted, onBeforeMount } from 'vue';
import { useToast } from 'primevue/usetoast';
import ApiService from '@/service/ApiService';

const toast = useToast();
const api = new ApiService();
const recibos = ref([]);
const reciboDialog = ref(false);
const deletereciboDialog = ref(false);
const deleterecibosDialog = ref(false);
const recibo = ref({
    id: null,
    fecha: null,
    total: '',
    metodopago: '',
    productos_id: ''
});
const selectedrecibos = ref([]);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

const data = ref([]);
const fetchData = async () => {
    try {
        const dataC = await api.get('recibos');
        recibos.value = dataC;
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
    deleterecibosDialog.value = true;
};

const deleteSelectedrecibos = async () => {
    try {
        for (const recibo of selectedrecibos.value) {
            await api.delete(`recibos/${recibo.id}`);
        }
        recibos.value = recibos.value.filter(val => !selectedrecibos.value.includes(val));
        data.value = recibos.value;
        deleterecibosDialog.value = false;
        selectedrecibos.value = [];
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Recibos Eliminado', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error Deleting recibos', life: 3000 });
    }
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
};

const openNew = () => {
    recibo.value = {
        id: null,
        fecha: null,
        total: '',
        metodopago: '',
        productos_id: ''
    };
    submitted.value = false;
    reciboDialog.value = true;
};

const hideDialog = () => {
    reciboDialog.value = false;
    submitted.value = false;
};

const saverecibo = async () => {
    submitted.value = true;
    if (recibo.value.fecha && recibo.value.total && recibo.value.metodopago && recibo.value.productos_id) {
        if (recibo.value.id) {
            try {
                await api.put(`recibos/${recibo.value.id}`, recibo.value);
                const index = recibos.value.findIndex(p => p.id === recibo.value.id);
                recibos.value[index] = recibo.value;
                data.value = recibos.value;
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Recibo Updated', life: 3000 });
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Error Updating recibo', life: 3000 });
            }
        } else {
            try {
                const response = await api.post('recibos', recibo.value);
                recibo.value.id = response.id;
                recibos.value.push(recibo.value);
                data.value = recibos.value;
                toast.add({ severity: 'success', summary: 'Successful', detail: 'Recibo Created', life: 3000 });
            } catch (error) {
                toast.add({ severity: 'error', summary: 'Error', detail: 'Error Creating recibo', life: 3000 });
            }
        }
        reciboDialog.value = false;
        recibo.value = {
            id: null,
            fecha: null,
            total: '',
            metodopago: '',
            productos_id: ''
        };
    }
};

const confirmDeleterecibo = (reciboToDelete) => {
    recibo.value = reciboToDelete;
    deletereciboDialog.value = true;
};

const deleterecibo = async () => {
    try {
        await api.delete(`recibos/${recibo.value.id}`);
        recibos.value = recibos.value.filter(val => val.id !== recibo.value.id);
        data.value = recibos.value;
        deletereciboDialog.value = false;
        recibo.value = {
            id: null,
            fecha: null,
            total: '',
            metodopago: '',
            productos_id: ''
        };
        toast.add({ severity: 'success', summary: 'Successful', detail: 'Recibo Eliminado', life: 3000 });
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error Deleting recibo', life: 3000 });
    }
};

// Opciones para el método de pago
const metodopagoOptions = [
    { label: 'Transferencia Bancaria', value: 'Transferencia Bancaria' },
    { label: 'QR', value: 'qr' }
];
</script>
<template>
  <div class="grid">
      <div class="col-12">
          <div class="card p-4 shadow-lg border-round">
              <Toolbar class="mb-4  text-white border-round">
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
                  currentPageReportTemplate="Showing {first} to {last} of {totalRecords} recibos"
                  class="bg-white border-round shadow-2"
              >
                  <template #header>
                      <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                          <h5 class="m-0 text-blue-600">RECIBO</h5>
                          <IconField iconPosition="left" class="block mt-2 md:mt-0">
                              <InputIcon class="pi pi-search text-blue-600" />
                              <InputText class="w-full sm:w-auto border-round-lg p-inputtext-sm" v-model="filters['global'].value" placeholder="Search..." />
                          </IconField>
                      </div>
                  </template>

                  <Column field="productos_id" header="ID Producto" :sortable="true" />
                  <Column field="fecha" header="Fecha" :sortable="true" />
                  <Column field="metodopago" header="Método de Pago" :sortable="true" />
                  <Column field="total" header="Total" :sortable="true" />

                  <Column headerStyle="min-width:10rem;">
                      <template #body="slotProps">
                          <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editrecibo(slotProps.data)" />
                          <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleterecibo(slotProps.data)" />
                      </template>
                  </Column>
              </DataTable>

              <Dialog v-model:visible="reciboDialog" :style="{ width: '450px' }" header="Recibo" :modal="true" class="p-fluid bg-blue-50 shadow-2">
                
                <div class="field">
                    <label for="productos_id" class="font-bold">ID Producto</label>
                    <InputText id="productos_id" v-model="recibo.productos_id" required class="border-round" />
                </div>
                

                <div class="field">
                      <label for="fecha" class="font-bold">Fecha</label>
                      <Calendar id="fecha" v-model="recibo.fecha" dateFormat="dd/mm/yy" showButtonBar required class="border-round" />
                      <small class="p-invalid" v-if="submitted && !recibo.fecha">Fecha es requerido.</small>
                  </div>

                  <div class="field">
                    <label for="metodopago" class="font-bold">Método de Pago</label>
                    <Dropdown
                        id="metodopago"
                        v-model="recibo.metodopago"
                        :options="metodopagoOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Selecciona un método de pago"
                        class="border-round"
                        required
                    />
                    <small class="p-invalid" v-if="submitted && !recibo.metodopago">Método de pago es requerido.</small>
                </div>

                  <div class="field">
                      <label for="total" class="font-bold">Total</label>
                      <InputText id="total" v-model="recibo.total" required class="border-round" />
                  </div>
                  
                 

                  <template v-slot:footer>
                      <Button label="Cancelar" icon="pi pi-times" @click="hideDialog" class="p-button-text" />
                      <Button label="Guardar" icon="pi pi-check" @click="saverecibo" class="p-button-primary" />
                  </template>
              </Dialog>

              <Dialog v-model:visible="deletereciboDialog" :style="{ width: '450px' }" header="Confirmación" modal class="p-fluid bg-red-50 shadow-2">
                  <div class="flex align-items-center">
                      <i class="pi pi-exclamation-triangle mr-3" style="font-size:2rem;"></i>
                      <span>¿Estás seguro de que quieres eliminar el recibo?</span>
                  </div>
                  <template v-slot:footer>
                      <Button label="Cancelar" icon="pi pi-times" @click="deletereciboDialog = false" class="p-button-text" />
                      <Button label="Eliminar" icon="pi pi-check" @click="deleterecibo" class="p-button-danger" />
                  </template>
              </Dialog>

              <Dialog v-model:visible="deleterecibosDialog" :style="{ width: '450px' }" header="Confirmación" modal class="p-fluid bg-red-50 shadow-2">
                  <div class="flex align-items-center">
                      <i class="pi pi-exclamation-triangle mr-3" style="font-size:2rem;"></i>
                      <span>¿Estás seguro de que quieres eliminar los recibos seleccionados?</span>
                  </div>
                  <template v-slot:footer>
                      <Button label="Cancelar" icon="pi pi-times" @click="deleterecibosDialog = false" class="p-button-text" />
                      <Button label="Eliminar" icon="pi pi-check" @click="deleteSelectedrecibos" class="p-button-danger" />
                  </template>
              </Dialog>
          </div>
      </div>
  </div>
</template>
