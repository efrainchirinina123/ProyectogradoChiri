'use strict';

const express = require('express');
const app = express();
const { sequelize } = require('./app/models/index');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

require('dotenv').config();
// require('dotenv').config({ path: '/custom/path/to/.env' })
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(
// 	cors({
// 		origin: ['http://localhost:5001', process.env.HOST_FRONT],
// 		credentials: true,
// 	})
// );
app.use(cors());

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('views', __dirname + '/views');

// Create an HTTP server
const server = http.createServer(app);

// Set up WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

// Export notifyProductChange to be used in CRUD operations
module.exports.notifyProductChange = (productData) => {
    broadcast(productData);
};

// Conexion a la base de datos
sequelize
    .authenticate()
    .then(() => {
        console.log('DB Connection exitosa yupi  :)  ..');
    })
    .catch((error) => {
        console.log('Failed to Connection DB Local\n', error);
    });
//  fin db

// TODO: Route for api
app.use('/api/v1', require('./app/routes/api/index'));

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Start the server
const PORT = process.env.PORT || 3010;
server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT} con ${process.env.MYSQL_USER} Y ${process.env.MYSQL_PASSWORD}`);
});
