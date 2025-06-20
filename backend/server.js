// backend/server.js (ACTUALIZADO)

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Estructura de datos actualizada para reflejar el nuevo payload
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

// Ruta POST actualizada para manejar el nuevo formato
app.post('/api/data', (req, res) => {
  console.log('Payload recibido:', req.body);
  const { values, states } = req.body;

  if (!values || !states) {
    return res.status(400).json({ error: 'Formato de datos incorrecto.' });
  }

  latestSensorData = {
    values: values,
    states: states,
    timestamp: new Date().toISOString()
  };

  res.status(200).json({ message: 'Datos recibidos correctamente.' });
});

// Ruta GET sin cambios, devolverá la nueva estructura completa
app.get('/api/data', (req, res) => {
  res.status(200).json(latestSensorData);
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});