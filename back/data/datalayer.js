const fs = require("fs");
const mysql = require("mysql2/promise");
const bcrypt = require('bcrypt');

//paramètres de la base de données (dépendent des variables d'environnement dans le fichier .env)
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
};

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
    
    createUser: function(pseudoKP, passwordKP) {
        //hachage du mot de passe passwordKP avec bcrypt
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(passwordKP, salt);
        hashedPasswordKP = hash;

        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO UserKP (pseudoKP, passwordKP) VALUES (?, ?)';
            connection.query(query, [pseudoKP, hashedPasswordKP], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },

    login : async function(pseudoKP, passwordKP) {
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

    getPasswords: async function (pseudoKP) {
        try {
            const connection = await mysql.createConnection(dbConfig);
            const [results] = await connection.query('SELECT website, pseudo, password FROM userstorage WHERE idUsersKP in (SELECT idUserKP from userkp WHERE pseudoKP = ?)', [pseudoKP]);
            await connection.end(); // Fermez la connexion après l'utilisation
            console.log('results:', results);
            return results;

        } catch (error) {
            throw new Error('Erreur lors de la récupération des mots de passe dans la base de données');
        }
    },

    // Suppression d'un mot de passe
    deletePassword: async function (userId, passwordId) {
        try {
            const connection = await mysql.createConnection(dbConfig);
            const [results] = await connection.query('DELETE FROM UserStorage WHERE idUsersKP = ? AND idAccount = ?', [userId, passwordId]);
            await connection.end(); // Fermez la connexion après l'utilisation
            return results;
        } catch (error) {
            throw new Error('Erreur lors de la suppression du mot de passe');
        }
    },

    // Modification d'un mot de passe
    updatePassword: async function (userId, passwordId, website, pseudo, password) {
        try {
            const connection = await mysql.createConnection(dbConfig);
            const [results] = await connection.query('UPDATE UserStorage SET website = ?, pseudo = ?, password = ? WHERE idUsersKP = ? AND idAccount = ?', [website, pseudo, password, userId, passwordId]);
            await connection.end(); // Fermez la connexion après l'utilisation
            return results;
        } catch (error) {
            throw new Error('Erreur lors de la modification du mot de passe');
        }
    },


    // getPasswordsByUserId : function(userId) {
    //     return new Promise((resolve, reject) => {
    //         const query = 'SELECT * FROM passwords WHERE userId = ?';
    //         connection.query(query, [userId], (error, results) => {
    //             if (error) {
    //                 reject(error);
    //             } else {
    //                 resolve(results);
    //             }
    //         });
    //     });
    // }

    // storePassword: function (pseudoKP, site, encryptedPassword) {
    //     return new Promise((resolve, reject) => {
    //         const getUserQuery = 'SELECT idUserKP FROM UserKP WHERE pseudoKP = ?';
    //         connection.query(getUserQuery, [pseudoKP], (error, results) => {
    //             if (error) {
    //                 reject(error);
    //             } else if (results.length > 0) {
    //                 const userId = results[0].idUserKP;
    //                 const query = 'INSERT INTO passwords (userId, site, password) VALUES (?, ?, ?)';
    //                 connection.query(query, [userId, site, encryptedPassword], (error, results) => {
    //                     if (error) {
    //                         reject(error);
    //                     } else {
    //                         resolve(results);
    //                     }
    //                 });
    //             } else {
    //                 reject(new Error('Utilisateur non trouvé'));
    //             }
    //         });
    //     });
    // },

    // getPassword: function (pseudoKP, site) {
    //     return new Promise((resolve, reject) => {
    //         const getUserQuery = 'SELECT idUserKP FROM UserKP WHERE pseudoKP = ?';
    //         connection.query(getUserQuery, [pseudoKP], (error, results) => {
    //             if (error) {
    //                 reject(error);
    //             } else if (results.length > 0) {
    //                 const userId = results[0].idUserKP;
    //                 const query = 'SELECT password FROM passwords WHERE userId = ? AND site = ?';
    //                 connection.query(query, [userId, site], (error, results) => {
    //                     if (error) {
    //                         reject(error);
    //                     } else if (results.length > 0) {
    //                         resolve(results[0].password);
    //                     } else {
    //                         reject(new Error('Mot de passe non trouvé'));
    //                     }
    //                 });
    //             } else {
    //                 reject(new Error('Utilisateur non trouvé'));
    //             }
    //         });
    //     });
    // }
};

module.exports = datalayer;