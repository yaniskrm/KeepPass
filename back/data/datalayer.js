const fs = require("fs");
const mysql = require("mysql2");


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
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
            connection.query(query, [pseudoKP, passwordKP], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
};

module.exports = datalayer;