const dal = require("../data/datalayer");

const bcrypt = require('bcrypt');


function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
}

function decrypt(text) {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey, 'hex'), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

const business = {
    // Business Layer (business/createUser.js)
    createUser: async function (pseudoKP, passwordKP) {
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

    login: async function (pseudoKP, passwordKP) {
        // Validation des données
        if (!pseudoKP || !passwordKP) {
            throw new Error('Veuillez fournir un nom d\'utilisateur et un mot de passe valides');
        }

        // Interaction avec la couche d'accès aux données pour récupérer l'utilisateur  
        const result = await dal.login(pseudoKP, passwordKP);

        return result;
    },

    getPasswords: async function (userId) {
        if (!userId) {
            throw new Error('ID utilisateur non fourni');
        }
        const passwords = await dal.getPasswords(userId);
        return passwords;
    },

    deletePassword: async function (userId, passwordId) {
        dal.deletePassword(userId, passwordId);
    },

    updatePassword: async function (userId, passwordId, website, pseudo, password) {
        dal.updatePassword(userId, passwordId, website, pseudo, password);
    }




    // listPasswords : async function (userId) {
    //     try {
    //         const passwords = await dal.getPasswordsByUserId(userId);
    //         return passwords;
    //     } catch (error) {
    //         throw new Error('Erreur lors de la récupération des mots de passe');
    //     }
    // },


    // encryptAndStorePassword: async function (pseudoKP, site, password) {
    //     if (!pseudoKP || !site || !password) {
    //         throw new Error('Veuillez fournir un pseudo, un site et un mot de passe');
    //     }
    //     const encryptedPassword = encrypt(password);
    //     const result = await dal.storePassword(pseudoKP, site, encryptedPassword);
    //     return result;
    // },

    // decryptAndRetrievePassword: async function (pseudoKP, site) {
    //     if (!pseudoKP || !site) {
    //         throw new Error('Veuillez fournir un pseudo et un site');
    //     }
    //     const encryptedPassword = await dal.getPassword(pseudoKP, site);
    //     const decryptedPassword = decrypt(encryptedPassword);
    //     return decryptedPassword;
    // }

};

module.exports = business;