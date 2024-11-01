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
export default ApiService;
