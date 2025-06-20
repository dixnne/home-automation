// backend/server.js (ACTUALIZADO CON HISTORIAL)

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- Almacenamiento de Datos en Memoria ---

// Variable para el último estado (sin cambios)
let latestSensorData = {
  values: {
    temperatura: 0,
    luminosidad: 0,
    distancia: 0,
  },
  states: {
    movimiento: "Iniciando...",
    ventilador: "Iniciando...",
    luces_verdes: "Iniciando...",
  },
  timestamp: new Date().toISOString()
};

// NUEVA variable para almacenar el historial completo
const dataHistory = []; 
const MAX_HISTORY_LENGTH = 1000; // Limitar el historial a 1000 entradas para no saturar la memoria

// --- Rutas de la API ---

// Ruta POST: El ESP32 envía datos aquí
app.post('/api/data', (req, res) => {
  console.log('Payload recibido:', req.body);
  const { values, states } = req.body;

  if (!values || !states) {
    return res.status(400).json({ error: 'Formato de datos incorrecto.' });
  }

  // Crear el nuevo objeto de datos con la hora actual
  const newData = {
    values: values,
    states: states,
    timestamp: new Date().toISOString()
  };
  
  // 1. Actualizar el último dato conocido
  latestSensorData = newData;

  // 2. Añadir el nuevo dato al historial
  dataHistory.push(newData);

  // 3. Mantener el historial con un tamaño máximo, eliminando el más antiguo si se excede
  if (dataHistory.length > MAX_HISTORY_LENGTH) {
    dataHistory.shift(); 
  }

  res.status(200).json({ message: 'Datos recibidos correctamente.' });
});

// Ruta GET para obtener los últimos datos (para los indicadores de estado)
app.get('/api/data', (req, res) => {
  res.status(200).json(latestSensorData);
});

// NUEVA RUTA GET para obtener todo el historial de datos
app.get('/api/history', (req, res) => {
  res.status(200).json(dataHistory);
});


app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
