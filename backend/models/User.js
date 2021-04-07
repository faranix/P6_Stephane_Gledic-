// === Import des dependances ou fichiers === //
const mongoose = require('mongoose');
const mongooseVerification = require('mongoose-unique-validator');

// Creation du schema de l'utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
})

// Vérifie si email est unique
userSchema.plugin(mongooseVerification);

module.exports = mongoose.model('User', userSchema);