const jwt = require('jsonwebtoken');

// Crèe un middleware qui vérifie le token

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodeToken = jwt.verify(token, 'NE_TROUVE_PAS_LA_CLE_STP_SA_SERAIT_VRAIMENT_SYMPA_DE_VOTRE_PART_MERCI_BIEN');
        const userId = decodeToken.userId;

        if (req.body.userId && req.body.userId !== userId) {
            throw 'User Id non valable !';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: error | 'Requete non authentifié !'})
    }
}