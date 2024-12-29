const WebSocket = require('ws');

function initOcppServer() {
  const wsServer = new WebSocket.Server({ port: 9000 });

  wsServer.on('connection', (socket) => {
    console.log('OCPP client connected');

    // Handle messages from the client
    socket.on('message', (message) => {
      console.log('Received:', message);
      
      // Simple response for OCPP Heartbeat
      const heartbeatResponse = JSON.stringify({
        id: 'Heartbeat',
        status: 'Accepted',
      });
      socket.send(heartbeatResponse);
    });

    socket.on('close', () => {
      console.log('OCPP client disconnected');
    });
  });

  console.log('OCPP server running on ws://localhost:9000');
}

module.exports = { initOcppServer };
