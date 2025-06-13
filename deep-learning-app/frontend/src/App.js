import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    // Check backend status
    fetch('http://localhost:5001/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: 1 }), // Test with a simple input
    })
      .then(() => setBackendStatus('connected'))
      .catch(() => setBackendStatus('disconnected'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:5001/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: parseFloat(input) }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to the server');
      }

      const data = await response.json();
      setResult(data.prediction);
    } catch (err) {
      setError('Unable to connect to the backend server. Please try again later.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Deep Learning Demo</h1>
        <div className="backend-status">
          Backend Status: 
          <span className={`status ${backendStatus}`}>
            {backendStatus === 'checking' ? 'Checking...' : 
             backendStatus === 'connected' ? 'Connected' : 'Not Available'}
          </span>
        </div>
        
        <div className="model-visualization">
          <h2>Neural Network Architecture</h2>
          <div className="model-image">
            <div className="model-layers">
              <div className="layer input-layer">
                <div className="node">x</div>
              </div>
              <div className="layer hidden-layer">
                <div className="node">h₁</div>
                <div className="node">h₂</div>
              </div>
              <div className="layer output-layer">
                <div className="node">y</div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="prediction-form">
          <div className="input-group">
            <label htmlFor="input">Enter a number:</label>
            <input
              type="number"
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a number"
              required
            />
          </div>
          <button type="submit" disabled={backendStatus !== 'connected'}>
            Predict
          </button>
        </form>

        {error && <div className="error">{error}</div>}
        {result !== null && (
          <div className="result">
            <h3>Prediction Result:</h3>
            <p>{result}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
