const fs = require('fs');
const https = require('https');
const app = require('./app');
const database = require('./database');
const config = require('../config/config');

database.connect()
  .then(() => {
    https.createServer({
      key: fs.readFileSync(config['server.key.path']),
      cert: fs.readFileSync(config['server.cert.path']),
    }, app).listen(config['server.port'], () => {
      console.log('Https server started in port', config['server.port']);
    });
  })
  .catch(() => {
    console.error('Error connecting to database.');
  });

process.on('SIGINT', () => {
  console.log('Process terminated');
  process.exit(0);
});
