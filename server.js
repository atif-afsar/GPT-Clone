require('dotenv').config();
const http = require('http');
const connectDB = require('./src/db/db.js');
const app = require('./src/app.js');
const setupSocketServer = require('./src/socket/socket.server..js');


const httpServer = http.createServer(app);

setupSocketServer(httpServer);


connectDB();

httpServer.listen(3000, () => {
    console.log('Server is running on port 3000');
});
