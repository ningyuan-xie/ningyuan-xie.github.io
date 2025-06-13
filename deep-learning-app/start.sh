#!/bin/bash

# Start the Flask backend
echo "Starting Flask backend..."
python app.py &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Start the React frontend
echo "Starting React frontend..."
cd frontend
npm start &
FRONTEND_PID=$!

# Function to handle script termination
function cleanup {
    echo "Shutting down servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

# Trap SIGINT (Ctrl+C) and call cleanup
trap cleanup SIGINT

# Wait for both processes
wait 