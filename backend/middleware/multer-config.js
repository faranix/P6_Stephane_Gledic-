// === Import des dependances ou fichiers === //
const multer = require('multer');

// Un objet qui contient les extentions
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/jpeg': 'jpg',
};

// Permet de stoker les fichiers avec un nom unique
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');       // Le fichier de destination ou les images seront stocker
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');        // remplace les ' ' par '_' pour pas avoir de probleme
        const extention = MIME_TYPES[file.mimetype];
        callback(null, name +  Date.now() + '.' + extention);       // Crée un nom unique pour l'image 
    }
});

module.exports = multer({ storage: storage }).single('image');