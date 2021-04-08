// === Import des dependances ou fichiers === //
const http = require('http');
const app = require('./app');


app.set('port', process.env.PORT || 3000);
const server = http.createServer(app);

// Le serveur sera disponible sur le port 3000
server.listen(process.env.PORT || 3000);