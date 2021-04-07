// === Import des dependances ou fichiers === //
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config()
const app = express();

// === ROUTER === //
const userRouter = require('./routes/user');
const saucesRouter = require('./routes/sauces');


// === Connecter la base MongoDB === //
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_MP}@p6db.nto6k.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connection a MongoDB '))
.catch(() => console.log('Probleme de connection a MongoDb'));

// Permet d'autoriser les appels de api
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Permet de PARSE les appels de type POST
app.use(bodyParser.json());

// La route pour les images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Les differentes routes
app.use('/api/sauces', saucesRouter);
app.use('/api/auth', userRouter);

module.exports = app;