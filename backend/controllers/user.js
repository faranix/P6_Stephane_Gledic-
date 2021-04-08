// === Import des dependances ou fichiers === //
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// Permet de crée un compte
exports.userSignup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)      // hash le mot de passe saisie 10 fois
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur crée !'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(400).json({ error }));
};

// Permet de s'identifier a un compte
exports.userLogin = (req, res, next) => {
    User.findOne( {email: req.body.email} )     // Trouver utilisateur par rapport a email car elle est unique
        .then(user => {
            if (!user) {
                return res.status(500).json({ message: 'Utilisateur introuvable' })
            }
            bcrypt.compare(req.body.password, user.password)        // Comparer le mot de pass saisie et celui dans la database
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Mot de passe incorrect !'})
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(        // Creation d'un token d'authendification
                            { userId: user._id},
                            `${process.env.KEYTOKEN}`,      // La clé du token ce situe dans le dossier environnement 
                            { expiresIn: '24h' }        // Le token expire dans 24h
                        )
                    })
                })
                .catch(error => res.status(401).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};