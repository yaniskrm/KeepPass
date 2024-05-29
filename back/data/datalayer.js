const fs = require("fs");
const mysql = require("mysql2/promise");
const bcrypt = require('bcrypt');
const { editPassword } = require("../business/business");

//Fonction de chiffrement pour le stocckage des mots de passe d'un user
const crypto = require('crypto');
const key = process.env.ENCRYPTION_KEY; // 32 bytes key for AES-256
console.log('key:', key);
//On utilise ici aes 256 en mode ctr
const algorithm = 'aes-256-ctr';

//Initialisation Vector pour le chiffrement
function generateIV() {
    return crypto.randomBytes(16);
}

//Fonction de chiffrement du mot de passe
function encryptPassword(password) {
    const iv = generateIV();
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
    const encrypted = Buffer.concat([cipher.update(password), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

//Fonction de déchiffrement du mot de passe
function decryptPassword(encryptedPassword) {
    const [iv, encrypted] = encryptedPassword.split(':');
    console.log('iv:', iv);
    console.log('encrypted:', encrypted);
    
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex')), decipher.final()]);
    return decrypted.toString();
}


//paramètres de la base de données (dépendent des variables d'environnement dans le fichier .env)
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
};

console.log('dbConfig:', dbConfig);

// Fonction de connection à la base de données
async function connectToDatabase() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connexion à la base de données réussie');
        return connection;
    } catch (error) {
        console.error('Erreur de connexion à la base de données', error);
        throw error;
    }
}

connectToDatabase();

let datalayer = {

    createUser: async function (pseudoKP, passwordKP) {
        try {
            if (!pseudoKP || !passwordKP) {
                throw new Error("Les champs pseudoKP et passwordKP sont requis");
            }

            const connection = await mysql.createConnection(dbConfig);

            // Vérification que le pseudo n'existe pas déjà
            const queryVerifPseudoKP = 'SELECT pseudoKP FROM userkp WHERE pseudoKP = ?';
            const [resultsVerifPseudoKP] = await connection.query(queryVerifPseudoKP, [pseudoKP]);
            console.log('resultsVerifPseudoKP.length', resultsVerifPseudoKP.length);
            if (resultsVerifPseudoKP.length > 0) {
                await connection.end();
                throw new Error('Ce nom d\'utilisateur existe déjà');
            }

            // Hachage du mot de passe avec bcrypt
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(passwordKP, salt);

            // Insertion du nouvel utilisateur
            const query = 'INSERT INTO UserKP (pseudoKP, passwordKP) VALUES (?, ?)';
            const [results] = await connection.query(query, [pseudoKP, hash]);

            await connection.end();

            return results;
        } catch (error) {
            console.error('Erreur lors de la création de l\'utilisateur:', error);
            throw new Error('Erreur lors de la création de l\'utilisateur');
        }
    },

    login: async function (pseudoKP, passwordKP) {
        try {
            const connection = await mysql.createConnection(dbConfig);
            const queryPassword = 'SELECT idUserKP, pseudoKP, passwordKP FROM UserKP WHERE pseudoKP = ?';

            // Utilisation de `query` pour obtenir les résultats et les champs
            const [results] = await connection.query(queryPassword, [pseudoKP]);

            await connection.end();

            if (results.length > 0) {
                const user = results[0];
                const match = await bcrypt.compare(passwordKP, user.passwordKP);

                if (match) {
                    return user;
                } else {
                    throw new Error('Mot de passe incorrect');
                }
            } else {
                throw new Error('Utilisateur non trouvé');
            }
        } catch (error) {
            console.error('Erreur de connexion à la base de données', error);
            throw new Error('Erreur lors de la connexion à la base de données');
        }
    },

    addPassword: async function (pseudoKP, website, pseudo, password) {
        try {
            const connection = await mysql.createConnection(dbConfig);
            const queryIdpseudoKP = 'SELECT idUserKP FROM userkp WHERE pseudoKP = ?';
            const [resultsIdpseudoKP] = await connection.query(queryIdpseudoKP, [pseudoKP]);
            await connection.end();

            if (resultsIdpseudoKP.length > 0) {
                const idUserKP = resultsIdpseudoKP[0].idUserKP;
                const encryptedPassword = encryptPassword(password);

                const connection = await mysql.createConnection(dbConfig);
                const query = 'INSERT INTO userstorage (idUsersKP, website, pseudo, password) VALUES (?, ?, ?, ?)';
                const [results] = await connection.query(query, [idUserKP, website, pseudo, encryptedPassword]);
                await connection.end();
                return results;
            } else {
                throw new Error('Utilisateur non trouvé');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout du mot de passe:', error);
            throw new Error('Erreur lors de l\'ajout du mot de passe');
        }
    },



    getPasswords: async function (pseudoKP) {
        try {
            const connection = await mysql.createConnection(dbConfig);
            const queryIdpseudoKP = 'SELECT idUserKP FROM userkp WHERE pseudoKP = ?';
            const [resultsIdpseudoKP] = await connection.query(queryIdpseudoKP, [pseudoKP]);
    
            if (resultsIdpseudoKP.length > 0) {
                const idUserKP = resultsIdpseudoKP[0].idUserKP;
                const query = 'SELECT website, pseudo, password FROM userstorage WHERE idUsersKP = ?';
                const [results] = await connection.query(query, [idUserKP]);
    
                const decryptedResults = results.map(row => ({
                    website: row.website,
                    pseudo: row.pseudo,
                    password: decryptPassword(row.password)
                }));
    
                await connection.end();
                return decryptedResults;
            } else {
                throw new Error('Utilisateur non trouvé');
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des mots de passe:', error);
            throw new Error('Erreur lors de la récupération des mots de passe');
        }
    },

    // Suppression d'un mot de passe
    deletePassword: async function (pseudoKP, website) {
        try {
            const connection = await mysql.createConnection(dbConfig);
            //Suppression de la ligne correspondante au pseudo et au site
            const query = 'DELETE FROM userstorage WHERE idUsersKP in (SELECT idUserKP from userkp WHERE pseudoKP = ?) AND website = ?';
            const [results] = await connection.query(query, [pseudoKP, website]);
            await connection.end(); // Fermez la connexion après l'utilisation
            return results;
        } catch (error) {
            throw new Error('Erreur lors de la suppression du mot de passe');
        }
    },

    // Modification d'un mot de passe
    updatePassword: async function (pseudoKP, website, pseudo, password) {
        try {
            const connection = await mysql.createConnection(dbConfig);
    
            // Construire la requête SQL dynamiquement
            let query = 'UPDATE userstorage SET';
            let updates = [];
            let params = [];
    
    
            //On fait les modifications en fonction des valeur ajoutées dans le formulaire
            if (pseudo) {
                updates.push('pseudo = ?');
                params.push(pseudo);
            }
            if (password) {
                // Chiffrement du nouveau mot de passe
                const encryptedPassword = encryptPassword(password);
                updates.push('password = ?');
                params.push(encryptedPassword);
            }
            if (updates.length === 0) {
                throw new Error('Aucune information à mettre à jour');
            }
    
            query += ' ' + updates.join(', ') + ' WHERE idUsersKP = (SELECT idUserKP from userkp WHERE pseudoKP = ?) AND website = ?';
            params.push(pseudoKP, website);
    
            const [results] = await connection.query(query, params);
            await connection.end(); // Fermez la connexion après l'utilisation
            return results;
        } catch (error) {
            throw new Error('Erreur lors de la modification du mot de passe');
        }
    },

};

module.exports = datalayer;