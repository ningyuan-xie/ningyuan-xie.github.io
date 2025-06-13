from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import torch
import torch.nn as nn
import numpy as np
import io
import graphviz

app = Flask(__name__)
CORS(app)

# Define a simple neural network
class SimpleNN(nn.Module):
    def __init__(self):
        super(SimpleNN, self).__init__()
        self.layer1 = nn.Linear(1, 10)
        self.layer2 = nn.Linear(10, 1)
        self.relu = nn.ReLU()

    def forward(self, x):
        x = self.relu(self.layer1(x))
        x = self.layer2(x)
        return x

# Initialize the model
model = SimpleNN()

def create_model_visualization():
    # Create a new directed graph
    dot = graphviz.Digraph(comment='Neural Network Architecture')
    dot.attr(rankdir='LR')  # Left to right layout
    dot.attr('node', shape='circle', style='filled', fillcolor='lightblue')
    dot.attr('edge', color='gray50')
    
    # Create subgraphs for each layer
    with dot.subgraph(name='cluster_0') as c:
        c.attr(label='Input Layer')
        c.node('input', 'Input\n(1)', fillcolor='lightgreen')
    
    with dot.subgraph(name='cluster_1') as c:
        c.attr(label='Hidden Layer')
        for i in range(10):
            c.node(f'hidden_{i}', f'H{i+1}', fillcolor='lightblue')
    
    with dot.subgraph(name='cluster_2') as c:
        c.attr(label='Output Layer')
        c.node('output', 'Output\n(1)', fillcolor='lightpink')
    
    # Add activation function
    dot.node('relu', 'ReLU', shape='box', fillcolor='lightyellow')
    
    # Connect input to hidden layer
    for i in range(10):
        dot.edge('input', f'hidden_{i}')
    
    # Connect hidden layer to ReLU
    dot.edge('hidden_0', 'relu', style='dashed')
    
    # Connect hidden layer to output
    for i in range(10):
        dot.edge(f'hidden_{i}', 'output')
    
    return dot

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        input_value = float(data['input'])
        
        # Convert input to tensor
        input_tensor = torch.FloatTensor([[input_value]])
        
        # Make prediction
        with torch.no_grad():
            prediction = model(input_tensor)
        
        return jsonify({
            'prediction': float(prediction.item()),
            'status': 'success'
        })
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 400

@app.route('/model-visualization', methods=['GET'])
def get_model_visualization():
    try:
        dot = create_model_visualization()
        # Save the visualization to a bytes buffer
        png_bytes = dot.pipe(format='png')
        return send_file(
            io.BytesIO(png_bytes),
            mimetype='image/png',
            as_attachment=True,
            download_name='model_architecture.png'
        )
    except Exception as e:
        return jsonify({
            'error': str(e),
            'status': 'error'
        }), 400

if __name__ == '__main__':
    app.run(debug=True, port=5001)
