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
    }
};

module.exports = datalayer;