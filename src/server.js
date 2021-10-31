const app = require('./app.js');
const database = require('./database.js');
const fs = require('fs');
const https = require('https');
const config = require('../config/config.js');

database.connect()
    .then(() => {
        https.createServer({
            key: fs.readFileSync(config['server.key.path']),
            cert: fs.readFileSync(config['server.cert.path'])
        }, app).listen(config['server.port'], () => {
            console.log("Https server started in port",config['server.port']);
        });
    });




process.on('SIGINT', () => {
    console.log('Process terminated');
    process.exit(0);
});