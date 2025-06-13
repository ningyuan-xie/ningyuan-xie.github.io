import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [modelImage, setModelImage] = useState(null);

  useEffect(() => {
    // Fetch model visualization when component mounts
    fetch('http://localhost:5001/model-visualization')
      .then(response => response.blob())
      .then(blob => {
        const imageUrl = URL.createObjectURL(blob);
        setModelImage(imageUrl);
      })
      .catch(err => {
        console.error('Failed to load model visualization:', err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: parseFloat(input) }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        setPrediction(data.prediction);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to connect to the server');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Simple Neural Network Demo</h1>
        
        {/* Model Visualization */}
        <div className="model-visualization">
          <h2>Model Architecture</h2>
          {modelImage ? (
            <img src={modelImage} alt="Neural Network Architecture" className="model-image" />
          ) : (
            <p>Loading model visualization...</p>
          )}
        </div>

        {/* Prediction Form */}
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a number"
            required
          />
          <button type="submit">Predict</button>
        </form>

        {/* Results */}
        {prediction !== null && (
          <div className="result">
            <h2>Prediction: {prediction.toFixed(4)}</h2>
          </div>
        )}
        {error && (
          <div className="error">
            <p>Error: {error}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
