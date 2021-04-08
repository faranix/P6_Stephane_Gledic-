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
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extention = MIME_TYPES[file.mimetype];
        callback(null, name +  Date.now() + '.' + extention);
    }
});

module.exports = multer({ storage: storage }).single('image');