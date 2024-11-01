const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3010;

// Middleware
app.use(bodyParser.json());

// Datos de ejemplo
let products = [];
let ofets = [];
let comments = [];

// Endpoint para obtener productos
app.get('/api/v1/productos', (req, res) => {
    res.json({ data: products });
});
app.get('/api/v1/ofertas', (req, res) => {
    res.json({ data: ofets });
});

// Endpoint para agregar comentario
app.post('/api/v1/comentarios', (req, res) => {
    const { nombre, comentario, producto_id } = req.body;
    if (nombre && comentario && producto_id) {
        comments.push({ nombre, comentario, producto_id });
        res.json({ success: true });
    } else {
        res.status(400).json({ success: false, message: 'Faltan datos' });
    }
});

// Endpoint para obtener comentarios
app.get('/api/v1/comentarios', (req, res) => {
    res.json(comments);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
