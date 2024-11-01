<template>
    <div>
        <!-- Muestra la imagen si existe -->
        <img  :src="'data:image/jpeg;base64,'+imagen.file64" alt="Imagen" width="50px" />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ApiService from '@/service/ApiService';


const props = defineProps({
    path: {
        type: String,
        required: true
    }
});

const api = new ApiService();
const imagen = ref([]);

const fetchData = async () => {
    try {
        const dataC = await api.getImage(props.path); // Usa el 'id' del props para la petición
        imagen.value = dataC;
        console.log(dataC);
    } catch (error) {
        console.error('Error fetching data:', error);
        // toast.add({ severity: 'error', summary: 'Error', detail: 'Error fetching data', life: 3000 });
    }
};

onMounted(() => {
    fetchData();
    console.log(props.path);
    
});

</script>
