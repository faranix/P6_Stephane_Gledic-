const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.userSignup = (req, res, next) => {
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

exports.userLogin = (req, res, next) => {
    User.findOne( {email: req.body.email} )
        .then(user => {
            if (!user) {
                return res.status(500).json({ message: 'Utilisateur introuvable' })
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Mot de passe incorrect !'})
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id},
                            'NE_TROUVE_PAS_LA_CLE_STP_SA_SERAIT_VRAIMENT_SYMPA_DE_VOTRE_PART_MERCI_BIEN',
                            { expiresIn: '24h' }
                        )
                    })
                })
                .catch(error => res.status(401).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};