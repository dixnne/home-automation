import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [sensorData, setSensorData] = useState({
    temperatura: 0,
    luminosidad: 0,
    distancia: 0,
    timestamp: 'Nunca'
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para obtener los datos de la API
  const fetchData = async () => {
    try {
      // Usamos una ruta relativa porque el proxy (Nginx) redirigirá la petición
      const response = await fetch('/api/data');
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      const data = await response.json();
      setSensorData(data);
      setError(null);
    } catch (err) {
      setError(`No se pudieron cargar los datos. ¿Está el backend funcionando? Error: ${err.message}`);
      console.error(err);
    } finally {
        setLoading(false);
    }
  };

  // useEffect para cargar los datos al iniciar y luego cada 3 segundos
  useEffect(() => {
    fetchData(); // Carga inicial
    const intervalId = setInterval(fetchData, 3000); // Refrescar cada 3 segundos

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);
  
  const getLuzStatus = (valorLDR) => {
    if (valorLDR > 3000) return "Oscuridad Total";
    if (valorLDR > 1500) return "Poca Luz";
    return "Luz Adecuada";
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard de Domótica</h1>
        <p>home.losnarvaez.com</p>
      </header>
      
      {error && <p className="error-message">{error}</p>}
      {loading && <p>Cargando datos...</p>}

      <main className="cards-container">
        <div className="card">
          <h2 className="card-title">🌡️ Temperatura</h2>
          <p className="card-value">{sensorData.temperatura.toFixed(2)} °C</p>
        </div>
        <div className="card">
          <h2 className="card-title">💡 Luminosidad</h2>
          <p className="card-value">{sensorData.luminosidad}</p>
          <p className="card-status">{getLuzStatus(sensorData.luminosidad)}</p>
        </div>
        <div className="card">
          <h2 className="card-title">📏 Presencia</h2>
          <p className="card-value">{sensorData.distancia > 0 ? `${sensorData.distancia.toFixed(1)} cm` : "Nada detectado"}</p>
          <p className="card-status">{sensorData.distancia > 0 && sensorData.distancia < 100 ? "¡Objeto Cercano!" : "Despejado"}</p>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>Última actualización: {new Date(sensorData.timestamp).toLocaleString()}</p>
      </footer>
    </div>
  );
}

export default App;