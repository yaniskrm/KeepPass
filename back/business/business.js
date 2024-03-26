const dal = require("../data/datalayer");

const business = {
    // Business Layer (business/createUser.js)
    createUser : async function (pseudoKP, passwordKP) {
        // Validation des données
        if (!pseudoKP || !passwordKP) {
            throw new Error('Veuillez fournir un nom d\'utilisateur et un mot de passe valides');
        }

        // Interaction avec la couche d'accès aux données pour insérer l'utilisateur
        const result = await dal.createUser(pseudoKP, passwordKP);
        return result;
    }

};

module.exports = business;