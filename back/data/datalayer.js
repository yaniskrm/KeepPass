const fs = require("fs");
const mysql = require("mysql2");
const bcrypt = require('bcrypt');


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
});

connection.connect(function (err) {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
});


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

    login : function(pseudo) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM UserKP WHERE pseudoKP = ?';
            connection.query(query, [pseudo], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results[0]);
                }
            });
        });
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