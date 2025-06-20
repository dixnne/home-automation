// frontend/src/App.jsx (ACTUALIZADO)

import React, { useState, useEffect } from 'react';
import './App.css'; 
// Para las gráficas, necesitarías una librería como 'recharts' o 'chart.js'
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function App() {
  const [data, setData] = useState({
    values: { temperatura: 0, luminosidad: 0, distancia: 0 },
    states: { movimiento: 'Cargando...', ventilador: 'Cargando...', luces_verdes: 'Cargando...' },
    timestamp: new Date().toISOString()
  });
  
  // Aquí almacenarías los datos para las gráficas
  // const [history, setHistory] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/data');
        const newData = await response.json();
        setData(newData);
        
        // Lógica para las gráficas (requiere una librería)
        // const newPoint = { time: new Date(newData.timestamp).toLocaleTimeString(), ...newData.values };
        // setHistory(prevHistory => [...prevHistory.slice(-20), newPoint]); // Mantener últimos 20 puntos
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);
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
        <h1>Dashboard Domótica: Los Narváez</h1>
        <p>Última actualización: {new Date(data.timestamp).toLocaleString()}</p>
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

      {/* Aquí irían las gráficas */}
      <section className="charts-container">
        <div className="chart-placeholder">
            <h3>Gráfica de Temperatura (°C)</h3>
            <p className="chart-value">{data.values.temperatura.toFixed(2)} °C</p>
            {/* <LineChart data={history} ... /> */}
        </div>
        <div className="chart-placeholder">
            <h3>Gráfica de Luminosidad (ADC)</h3>
            <p className="chart-value">{data.values.luminosidad}</p>
        </div>
        <div className="chart-placeholder">
            <h3>Gráfica de Distancia (cm)</h3>
             <p className="chart-value">{data.values.distancia.toFixed(1)} cm</p>
        </div>
      </section>
    </div>
  );
}

export default App;