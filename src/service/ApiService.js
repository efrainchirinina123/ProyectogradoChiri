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

    async post(endpoint, data) {
        try {
            const response = await axios.post(`${this.apiBaseUrl}/${endpoint}`, data);
            console.log(`POST ${this.apiBaseUrl}/${endpoint}`, data, response.data);
            return response.data;
        } catch (error) {
            console.error(`Error en POST ${this.apiBaseUrl}/${endpoint}:`, error.response ? error.response.data : error.message);
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
    async getImage(path) {
        try {
            const response = await axios.get(`https://serverfilesdev.esam.edu.bo/v1/files/${path}`);
            return response.data; // Retorna solo los datos en lugar del objeto de respuesta completo
        } catch (error) {
            console.error('Error al obtener la imagen:', error.response ? error.response.data : error.message);
            throw error; // Mantén el lanzamiento de errores para que se manejen en otro lugar
        }
    }

    async createImage(base64Image) {
        try {
            const response = await axios.post('https://serverfiles.esam.edu.bo/v1/files/', {
                app: 'esam.certificados',
                base64: base64Image,
            });
            console.log('Server response Image:', response.data); // Muestra solo los datos de la respuesta
            return response.data; // Asegúrate de retornar solo los datos relevantes
        } catch (error) {
            console.error('Error al crear la imagen:', error.response ? error.response.data : error.message);
            throw error; // Mantén el lanzamiento de errores para que se manejen en otro lugar
        }
    }
}

export default ApiService;
