import axios from 'axios';

class ApiService {
    constructor() {
        this.apiBaseUrl = 'http://localhost:3010/api/v1/';
    }

    async get(endpoint, params = {}) {
        try {
            const response = await axios.get(`${this.apiBaseUrl}/${endpoint}`, {
                params: params
            });
            console.log(`GET ${this.apiBaseUrl}/${endpoint}`, params, response.data);
            return response.data.data;
        } catch (error) {
            console.error(`Error en GET ${this.apiBaseUrl}/${endpoint}:`, error.response ? error.response.data : error.message);
            throw error;
        }
    }

    async put(endpoint, data) {
        try {
            const response = await axios.put(`${this.apiBaseUrl}/${endpoint}`, data);
            console.log(`PUT ${this.apiBaseUrl}/${endpoint}`, data, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error en PUT ${this.apiBaseUrl}/${endpoint}:`, error.response ? error.response.data : error.message);
            throw error;
        }
    }
    async delete(endpoint) {
        try {
            const response = await axios.delete(`${this.apiBaseUrl}/${endpoint}`);
            console.log(`DELETE ${this.apiBaseUrl}/${endpoint}`, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error en DELETE ${this.apiBaseUrl}/${endpoint}:`, error.response ? error.response.data : error.message);
            throw error;
        }
    }
    async post(endpoint, data) {
        try {
            const response = await axios.post(`${this.apiBaseUrl}/${endpoint}`, data);
            console.log(`POST ${this.apiBaseUrl}/${endpoint}`, data, response.data);
            return response.data;
        } catch (error) {
            const errorMessage = error.response ? error.response.data : error.message;
            console.error(`Error en POST ${this.apiBaseUrl}/${endpoint}:`, errorMessage);
            throw new Error(`No se pudo completar la solicitud POST: ${errorMessage}`);
        }
    }

 // Obtener la imagen a partir de su ruta
    async getImage(path) {
        try {
            // Asegúrate de que la URL sea correcta
            const response = await axios.get(`https://serverfilesdev.esam.edu.bo/v1/files/${path}`);
          
          console.log('aquiiiiii');
          
            return response.data; // Retorna solo los datos de la imagen
        } catch (error) {
           
            // throw new Error(`No se pudo obtener la imagen: ${errorMessage}`);
        }
    }

    // Crear una imagen a partir de una cadena Base64
    async createImage(base64Image) {
        // Validación de que base64Image no esté vacío
        if (!base64Image) {
            throw new Error('La imagen base64 no puede estar vacía.');
        }

        try {
            const response = await axios.post('https://serverfilesdev.esam.edu.bo/v1/files/', {
                app: 'esam.certificados',
                base64: base64Image,
            }, {
                headers: {
                    'Content-Type': 'application/json' // Especifica el tipo de contenido si es necesario
                }
            });
            console.log('Respuesta del servidor al crear la imagen:', response.data); // Muestra solo los datos de la respuesta
            return response.data; // Retorna solo los datos relevantes
        } catch (error) {
            const errorMessage = error.response ? error.response.data : error.message;
            console.error('Error al crear la imagen:', errorMessage);
            throw new Error(`No se pudo crear la imagen: ${errorMessage}`);
        }
    }
}
// Función para obtener la imagen desde la API
async function fetchImage(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error('Error al obtener la imagen');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener la imagen:', error);
        return null;
    }
}

// Función para asignar la imagen al fondo del enlace
async function displayImage() {
    const path = 'URL_DE_TU_API'; // Reemplaza con la URL correcta de tu API
    const imageData = await fetchImage(path);
    const imageUrl = imageData && imageData.file64 ? 'data:image/jpeg;base64,' + imageData.file64 : 'images/default-image.jpg';
    const imageElement = document.querySelector('.menu-img');

    // Asigna la URL de la imagen como fondo
    imageElement.style.backgroundImage = `url(${imageUrl})`;
}

// Ejecutar la función al cargar la página
window.onload = function () {
    displayImage();
};
export default ApiService;
