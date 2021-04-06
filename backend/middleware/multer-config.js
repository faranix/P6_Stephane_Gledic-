const multer = require('multer');

const MINE_TYPE = {
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/jpeg': 'jpg',
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extention = MINE_TYPE[file.minetype];
        callback(null, name +  Date.now() + '.' + extention);
    }
})

module.exports = multer({ storage }).single('image');