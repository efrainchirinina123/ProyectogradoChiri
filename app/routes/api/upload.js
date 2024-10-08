// app.js

const express = require('express');
const app = express();
const { sequelize } = require('./app/models/index');
const cors = require('cors');
const path = require('path');

require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware para permitir CORS
app.use(cors());

// Configuración de la carpeta estática para archivos públicos
app.use(express.static('public'));

// Ruta para la carga de imágenes
app.use('/api/v1/upload', require('./routes/api/upload'));

// Otras rutas de la API
app.use('/api/v1', require('./routes/api/index'));

// Ruta de fallback para SPA (Vue.js frontend)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Conexión a la base de datos
sequelize
    .authenticate()
    .then(() => {
        console.log('Conexión exitosa a la base de datos.');
    })
    .catch((error) => {
        console.error('Error al conectar con la base de datos:', error);
    });

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
