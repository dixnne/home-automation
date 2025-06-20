// frontend/src/App.jsx (ACTUALIZADO CON GRÁFICAS DINÁMICAS)

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css'; 

function App() {
  const [data, setData] = useState({
    values: { temperatura: 0, luminosidad: 0, distancia: 0 },
    states: { movimiento: 'Cargando...', ventilador: 'Cargando...', luces_verdes: 'Cargando...' },
    timestamp: new Date().toISOString()
  });
  
  // Estado para almacenar el historial de datos para las gráficas
  const [history, setHistory] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const newData = await response.json();
        setData(newData);
        
        // Añadir el nuevo punto de datos al historial para las gráficas
        const newPoint = { 
          // Formatear la hora para el eje X
          time: new Date(newData.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          temperatura: newData.values.temperatura.toFixed(2),
          luminosidad: newData.values.luminosidad,
          distancia: newData.values.distancia.toFixed(1)
        };
        // Mantener solo los últimos 20 puntos de datos para que la gráfica no se sature
        setHistory(prevHistory => [...prevHistory.slice(-19), newPoint]); 
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000); // Se actualiza cada 5 segundos
    return () => clearInterval(intervalId);
  }, []);

  const getStatusColor = (status) => {
    if (status === 'Encendido' || status === 'Encendidas' || status === 'Detectado') {
        return 'status-on';
    }
    return 'status-off';
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard Domótica</h1>
        <p>Última actualización: {new Date(data.timestamp).toLocaleString('es-MX')}</p>
      </header>
      
      {/* Indicadores de estado */}
      <section className="status-indicators">
        <div className="indicator">
            <h3>Movimiento Entrada</h3>
            <p className={`status-text ${getStatusColor(data.states.movimiento)}`}>{data.states.movimiento}</p>
        </div>
        <div className="indicator">
            <h3>Ventilador</h3>
            <p className={`status-text ${getStatusColor(data.states.ventilador)}`}>{data.states.ventilador}</p>
        </div>
        <div className="indicator">
            <h3>Luces de Noche</h3>
            <p className={`status-text ${getStatusColor(data.states.luces_verdes)}`}>{data.states.luces_verdes}</p>
        </div>
      </section>

      {/* Contenedor de Gráficas Dinámicas */}
      <section className="charts-container">
        <div className="chart-wrapper">
            <h3>Temperatura (°C)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={history} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#e0e0e0" />
                <YAxis stroke="#e0e0e0" />
                <Tooltip contentStyle={{ backgroundColor: '#162447', border: '1px solid #00e5ff' }}/>
                <Legend />
                <Line type="monotone" dataKey="temperatura" name="Temperatura" stroke="#ff6b6b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
        </div>
        <div className="chart-wrapper">
            <h3>Luminosidad (ADC)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={history} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#e0e0e0" />
                <YAxis stroke="#e0e0e0" />
                <Tooltip contentStyle={{ backgroundColor: '#162447', border: '1px solid #00e5ff' }}/>
                <Legend />
                <Line type="monotone" dataKey="luminosidad" name="Luminosidad" stroke="#feca57" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
        </div>
        <div className="chart-wrapper">
            <h3>Distancia (cm)</h3>
             <ResponsiveContainer width="100%" height={250}>
              <LineChart data={history} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="time" stroke="#e0e0e0" />
                <YAxis stroke="#e0e0e0" />
                <Tooltip contentStyle={{ backgroundColor: '#162447', border: '1px solid #00e5ff' }}/>
                <Legend />
                <Line type="monotone" dataKey="distancia" name="Distancia" stroke="#48dbfb" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

export default App;