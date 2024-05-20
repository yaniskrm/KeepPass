const dal = require("../data/datalayer");

const bcrypt = require('bcrypt');


const business = {
    // Business Layer (business/createUser.js)
    createUser : async function (pseudoKP, passwordKP) {
        // Validation des données
        if (!pseudoKP || !passwordKP) {
            throw new Error('Veuillez fournir un nom d\'utilisateur et un mot de passe valides');
        }
        //Verification si le pseudo existe déjà
        const user = await dal.login(pseudoKP);
        if (user) {
            throw new Error('Ce nom d\'utilisateur existe déjà');
        }

        // Interaction avec la couche d'accès aux données pour insérer l'utilisateur
        const result = await dal.createUser(pseudoKP, passwordKP);
        return result;
    },

    login : async function (pseudo, password) {
        try {
            const user = await dal.login(pseudo);
            if (user) {
                const match = await bcrypt.compare(password, user.passwordKP);
                if (match) {
                    return { success: true, message: 'Connexion réussie', userId: user.idUserKP, pseudo: user.pseudoKP };
                } else {
                    return { success: false, message: 'Échec de la connexion : mot de passe incorrect' };
                }
            } else {
                return { success: false, message: 'Échec de la connexion : utilisateur non trouvé' };
            }
        } catch (error) {
            throw new Error('Erreur lors de la connexion à la base de données');
        }
    },


    // listPasswords : async function (userId) {
    //     try {
    //         const passwords = await dal.getPasswordsByUserId(userId);
    //         return passwords;
    //     } catch (error) {
    //         throw new Error('Erreur lors de la récupération des mots de passe');
    //     }
    // }

};

module.exports = business;