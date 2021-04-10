// === Import des dependances ou fichiers === //
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// Permet de crée un compte
exports.userSignup = (req, res, next) => {
    // hash le mot de passe saisie 10 fois
    bcrypt.hash(req.body.password, 10)      
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
    // Trouver utilisateur par rapport a email car elle est unique
    User.findOne( {email: req.body.email} )     
        .then(user => {
            if (!user) {
                return res.status(500).json({ message: 'Utilisateur introuvable' })
            }
            // Comparer le mot de pass saisie et celui dans la database
            bcrypt.compare(req.body.password, user.password)        
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Mot de passe incorrect !'})
                    }
                    res.status(200).json({
                        userId: user._id,
                        // Creation d'un token d'authendification
                        token: jwt.sign(        
                            { userId: user._id},
                            // La clé du token ce situe dans le dossier environnement 
                            `${process.env.KEYTOKEN}`, 
                            // Le token expire dans 24h     
                            { expiresIn: '24h' }        
                        )
                    })
                })
                .catch(error => res.status(401).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};