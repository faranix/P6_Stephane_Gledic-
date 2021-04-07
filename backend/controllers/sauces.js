const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObjet = JSON.parse(req.body.sauce);
    delete sauceObjet._id;
    const sauce = new Sauce({
        ...sauceObjet,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce crée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.modifileSauce = (req, res, next) => {
    const sauceObjet = req.file ? { 
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
     } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id}, {...sauceObjet, _id: req.params.id})
        .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ id: req.params.id})
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

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};


exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};


// Like une sauce

// TEST
exports.likeOneSauces = (req, res, next) => {
    Sauce.findByIdAndUpdate({ _id: req.params.id }, {...req.body})
        .then(sauce => {  
            
            if (req.body.like == 1) {

                // USER Like 

                if (sauce.usersLiked.includes(req.body.userId) == true) {
                    // Recuperer la position de user dans le tableau
                    const index = sauce.usersLiked.indexOf(req.body.userId);
                    // Supprimer user du tableau 
                    sauce.usersLiked.splice(index, 1);
                    // sauvegarder les modifcation
                    sauce.save()
                        .then(() => res.status(200).json({message: 'Vous avez deja like !'}))
                        .catch(error => res.status(400).json({ error }));
                } else {
                    if (req.body.like == 1) {
                        sauce.usersLiked.push(req.body.userId);
                        if(sauce.usersDisliked.includes(req.body.userId) == true) {
                            // Recuperer la position de user dans le tableau
                            const index = sauce.usersLiked.indexOf(req.body.userId);
                            // Supprimer user du tableau 
                            sauce.usersLiked.splice(index, 1);
                        }
                        sauce.likes = sauce.usersLiked.length;
                        if(sauce.dislikes >= 1) {
                            sauce.dislikes--;
                        }
                        sauce.save()
                            .then(() => res.status(200).json({message: 'Sauce like'}))
                            .catch(error => res.status(400).json({ error }));
                    
                    } 
                }

            }

                        
            if (req.body.like == -1) {

                // USER Dislike 


                if (sauce.usersDisliked.includes(req.body.userId) == true) {
                    // Recuperer la position de user dans le tableau
                    const index = sauce.usersDisliked.indexOf(req.body.userId);
                    // Supprimer user du tableau 
                    sauce.usersDisliked.splice(index, 1);
                    // sauvegarder les modifcation
                    sauce.save()
                        .then(() => res.status(200).json({message: 'Vous avez deja dislike !'}))
                        .catch(error => res.status(400).json({ error }));
                } else {
                    if (req.body.like == -1) {
                        sauce.usersDisliked.push(req.body.userId);
                        if(sauce.usersLiked.includes(req.body.userId) == true) {
                            // Recuperer la position de user dans le tableau
                            const index = sauce.usersDisliked.indexOf(req.body.userId);
                            // Supprimer user du tableau 
                            sauce.usersDisliked.splice(index, 1);
                        }
                        sauce.dislikes = sauce.usersDisliked.length;
                        if(sauce.likes >= 1) {
                            sauce.likes--;
                        }
                        sauce.save()
                            .then(() => res.status(200).json({message: 'Sauce dislike'}))
                            .catch(error => res.status(400).json({ error }));
                    
                    } 
                }


            } 


            // Verification 

            if(sauce.usersLiked.length == 0) {
                sauce.likes = 0;
            };

            if(sauce.usersDisliked.length == 0) {
                sauce.usersDisliked = 0;
            };

            console.log('User Like:', sauce.usersLiked);
            console.log('User Dislike:', sauce.usersDisliked);

            res.status(200).json({message: 'Like modifié !'})
        })
        .catch(error => res.status(400).json({ error }));
};
