// === Import des dependances ou fichiers === //
const mongoose = require('mongoose');


// Creation du schema d'une sauces
const sauceSchema = mongoose.Schema({
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number, required: true, default: 0},
    dislikes: { type: Number, required: true, default: 0 },
    usersLiked: [{ type: String, required: true, default: [] }],
    usersDisliked: [{ type: String }],
    userId: { type: String, required: true, default: [] },
});


module.exports = mongoose.model('Sauce', sauceSchema);