// === Import des dependances ou fichiers === //
const jwt = require('jsonwebtoken');
require('dotenv').config();


// Un middleware general qui permet de vérifier le token et de le valider avec "next()"
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodeToken = jwt.verify(token, `${process.env.KEYTOKEN}`);       // Verification du token qui correption bien a la clé
        const userId = decodeToken.userId;

        if (req.body.userId && req.body.userId !== userId) {        // Verifie que userId de la requete et bien celui de la database
            throw 'User Id non valable !';
        } else {
            next();     // Si oui passe au prochain middleware
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requete non authentifié !'})
    }
}