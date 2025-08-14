const { Server } = require('socket.io');
const aiService = require('../services/ai.service');

function setupSocketServer(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: '*', // configure for your frontend
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log("A user connected");

        socket.on('ai-message', async (message) => {
             const result = await aiService.generateContent(message);
             socket.emit('ai-message', result);
        });

        socket.on('disconnect', () => {
            console.log("A user disconnected");
        });
    });

    return io; 
}

module.exports = setupSocketServer;
