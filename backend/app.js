const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// === ROUTER === //
const userRouter = require('./routes/user');
const saucesRouter = require('./routes/sauces');

// === Connecter la base MongoDb === //

mongoose.connect('mongodb+srv://faranix:azerty123@p6db.nto6k.mongodb.net/P6DB?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connection a MongoDB '))
.catch(() => console.log('Probleme de connection a MongoDb'));

// === HEADER === //

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

// Pour les requetes d'images
app.use('images', express.static(path.join(__dirname, 'images')));

app.use('/api/sauces', saucesRouter);
app.use('/api/auth', userRouter);

module.exports = app;