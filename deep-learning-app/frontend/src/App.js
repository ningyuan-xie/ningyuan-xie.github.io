import React, { useState, useEffect } from 'react';
import './App.css';

function NeuralNetworkVisualization() {
  // Define the structure: 1 input, 2 hidden, 1 output
  const layers = [
    [{ label: 'x', className: 'input-layer' }],
    [
      { label: 'h₁', className: 'hidden-layer' },
      { label: 'h₂', className: 'hidden-layer' },
    ],
    [{ label: 'y', className: 'output-layer' }],
  ];

  // Node positions for SVG lines
  const nodePositions = [
    [{ x: 80, y: 150 }], // input
    [
      { x: 300, y: 90 },
      { x: 300, y: 210 },
    ], // hidden
    [{ x: 520, y: 150 }], // output
  ];

  // Generate SVG lines for full connections
  const lines = [];
  for (let l = 0; l < nodePositions.length - 1; l++) {
    for (let i = 0; i < nodePositions[l].length; i++) {
      for (let j = 0; j < nodePositions[l + 1].length; j++) {
        const from = nodePositions[l][i];
        const to = nodePositions[l + 1][j];
        lines.push(
          <line
            key={`line-${l}-${i}-${j}`}
            x1={from.x + 30}
            y1={from.y + 30}
            x2={to.x + 30}
            y2={to.y + 30}
            stroke="#61dafb"
            strokeWidth="2"
            opacity="0.5"
          />
        );
      }
    }
  }

  return (
    <div className="model-visualization">
      <h2>Neural Network Architecture</h2>
      <div style={{ position: 'relative', width: 600, height: 300, margin: '0 auto' }}>
        <svg width="600" height="300" style={{ position: 'absolute', left: 0, top: 0, zIndex: 0 }}>
          {lines}
        </svg>
        {layers.map((layer, lIdx) =>
          layer.map((node, nIdx) => {
            const pos = nodePositions[lIdx][nIdx];
            return (
              <div
                key={`node-${lIdx}-${nIdx}`}
                className={`node ${node.className}`}
                style={{
                  position: 'absolute',
                  left: pos.x,
                  top: pos.y,
                  zIndex: 1,
                }}
              >
                {node.label}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

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
        
        <NeuralNetworkVisualization />

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
