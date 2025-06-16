// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001; // El puerto interno para el backend

// Middlewares
app.use(cors()); // Permite peticiones desde otros orígenes (tu frontend)
app.use(express.json()); // Permite al servidor entender JSON

// Variable en memoria para almacenar el último estado de los sensores.
// En un proyecto real, usarías una base de datos (e.g., MongoDB, PostgreSQL).
let latestSensorData = {
  temperatura: 0,
  luminosidad: 0,
  distancia: 0,
  timestamp: new Date().toISOString()
};

// --- RUTAS DE LA API ---

// POST /api/data - Ruta para que el ESP32 envíe datos
app.post('/api/data', (req, res) => {
  console.log('Datos recibidos del ESP32:', req.body);
  const { temperatura, luminosidad, distancia } = req.body;

  // Validación simple
  if (temperatura === undefined || luminosidad === undefined || distancia === undefined) {
    return res.status(400).json({ error: 'Faltan datos en la petición.' });
  }

  // Actualizar los datos
  latestSensorData = {
    temperatura: parseFloat(temperatura),
    luminosidad: parseInt(luminosidad),
    distancia: parseFloat(distancia),
    timestamp: new Date().toISOString()
  };

  res.status(200).json({ message: 'Datos recibidos correctamente.' });
});

// GET /api/data - Ruta para que el frontend pida los últimos datos
app.get('/api/data', (req, res) => {
  res.status(200).json(latestSensorData);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});