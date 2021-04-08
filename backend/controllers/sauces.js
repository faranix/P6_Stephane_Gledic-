// === Import des dependances ou fichiers === //
const Sauce = require('../models/Sauce');
const fs = require('fs');

// Permet de crée une sauce
exports.createSauce = (req, res, next) => {
    const sauceObjet = JSON.parse(req.body.sauce);
    delete sauceObjet._id;
    const sauce = new Sauce({
        ...sauceObjet,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        userId: sauceObjet.userId,
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce crée !'}))
        .catch(error => res.status(400).json({ error }));
};

// Permet de modifié une sauce
exports.updateSauce = (req, res, next) => {
    const sauceObjet = req.file ? { 
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
     } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id}, {...sauceObjet, _id: req.params.id})
        .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
        .catch(error => res.status(400).json({ error }));
};

// Permet de supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Sauce Supprimer !'}))
                .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};

// Permet d'obtenir une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};


// Permet d'obtenir toute les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};


// Permet de Like ou deDislike

// TEST
// --- Probleme: userId ce modifie aux click sur un like --- //
exports.likeOneSauces = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            //  ========   USER sans choix  ======= //
            if (req.body.like == 0) {

                if (sauce.usersLiked.includes(req.body.userId) == true) {
                    // Recuperer la position de user dans le tableau
                    const index = sauce.usersLiked.indexOf(req.body.userId);
                    // Supprimer user du tableau 
                    sauce.usersLiked.splice(index, 1);
                }

                if (sauce.usersDisliked.includes(req.body.userId) == true) {
                    // Recuperer la position de user dans le tableau
                    const index = sauce.usersDisliked.indexOf(req.body.userId);
                    // Supprimer user du tableau 
                    sauce.usersDisliked.splice(index, 1);
                }
            }
            
            //  ========   USER Like  ======= //
            if (req.body.like == 1) {
                sauce.usersLiked.push(req.body.userId);
            }

           //  ========   USER Dislike  ======= //

            if (req.body.like == -1) {
                sauce.usersDisliked.push(req.body.userId);
            } 

            // Verification si les tableau sont vide

            if(sauce.usersLiked.length == 0) {
                sauce.likes = 0;
            } else {
                sauce.likes = sauce.usersLiked.length;
            };

            if(sauce.usersDisliked.length == 0) {
                sauce.dislikes = 0;
            } else {
                sauce.dislikes = sauce.usersDisliked.length;
            }

            sauce.save()
                .then(() => res.status(200).json(sauce))
                .catch(error => res.status(400).json({ error })); 

        })
        .catch(error => res.status(400).json({ error }));
};
