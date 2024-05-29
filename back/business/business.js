const e = require("express");
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
        const user = await dal.createUser(pseudoKP, passwordKP);
        if (!user) {
            throw new Error('Ce nom d\'utilisateur existe déjà');
        }

        return user;
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

    addPassword : async function (pseudoKP, website, pseudo, password) {
        if (!pseudoKP || !website || !pseudo || !password) {
            throw new Error('Veuillez fournir un pseudo, un site et un mot de passe');
        }
        const result = await dal.addPassword(pseudoKP, website, pseudo, password);
        return result;
    },

    getPasswords: async function (pseudoKP) {
        if (!pseudoKP) {
            throw new Error("Vous n'etes pas connecté ! Veuillez vous connecter pour accéder à vos mots de passe");
        }
        const passwords = await dal.getPasswords(pseudoKP);
        return passwords;
    },

    deletePassword: async function (userId, passwordId) {
        dal.deletePassword(userId, passwordId);
    },

    editPassword: async function (pseudoKP, originalWebsite, website, pseudo, password) {
        if (!pseudoKP || !originalWebsite) {
            throw new Error('Pseudo utilisateur et site original sont requis');
        }
        const result = await dal.updatePassword(pseudoKP, originalWebsite, website, pseudo, password);
        return result;
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