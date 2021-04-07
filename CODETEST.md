=====> LIKE AND DISLIKE <=====

// Fonctionne a 50% mais trop compliquer 
exports.likeOneSauces = (req, res, next) => {
    Sauce.findOneAndUpdate({ _id: req.params.id }, {...req.body})
        .then(sauce => {

            if (sauce.usersLiked.includes(req.body.userId) == true) {
                sauce.usersLiked.splice(0, 1);
                console.log(sauce.usersLiked);
                sauce.save()
                    .then(() => res.status(200).json({message: 'Vous avez deja like !'}))
                    .catch(error => res.status(400).json({ error }));
            } else {
                if (req.body.like == 1) {
                    sauce.usersLiked.push(req.body.userId);
                    if(sauce.usersDisliked) {
                        sauce.usersDisliked.splice(0, 1);
                    }
                    console.log(sauce.usersLiked);
                    console.log(sauce.likes = sauce.usersLiked.length);
                    sauce.likes = sauce.usersLiked.length;
                    if(sauce.dislikes >= 1) {
                        sauce.dislikes--;
                    }
                    sauce.save()
                        .then(() => res.status(200).json({message: 'Sauce like'}))
                        .catch(error => res.status(400).json({ error }));
                
                } 
            }


            if (sauce.usersDisliked.includes(req.body.userId) == true) {
                while (sauce.usersDisliked.includes(req.body.userId)) {
                    sauce.usersDisliked.splice(0, 1);
                }
                console.log(sauce.usersDisliked);
                sauce.save()
                    .then(() => res.status(200).json({message: 'Vous avez deja dislike !'}))
                    .catch(error => res.status(400).json({ error }));
            } else {
                if (req.body.like == -1) {
                    sauce.usersDisliked.push(req.body.userId);
                    if(sauce.usersLiked) {
                        sauce.usersLiked.splice(0, 1);
                    }
                    console.log(sauce.usersDisliked);
                    console.log(sauce.dislikes = sauce.dislikes.length);
                    if(sauce.likes >= 1) {
                        sauce.likes--;
                    }
                    sauce.save()
                        .then(() => res.status(200).json({message: 'Sauce dislike'}))
                        .catch(error => res.status(400).json({ error }));
                
                } 
            }
        })
        .catch(error => res.status(400).json({ error }));
};

// ====== PROBLEME ====== //

Le dislike fait un tableau sous forme array 
