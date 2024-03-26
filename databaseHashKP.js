require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Configuration de la connexion à la base de données en utilisant des variables d'environnement (voir le fichier .env)
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD
};

//Hache le mot de passe
async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

//Insère un utilisateur dans la base de données
async function insertUser(pseudoKP, passwordKP) {
    const connection = await mysql.createConnection(dbConfig);
    const hashedPassword = await hashPassword(passwordKP);
    await connection.execute(
        'INSERT INTO UserKP (pseudoKP, passwordKP) VALUES (?, ?)',
        [pseudoKP, hashedPassword]
    );
    await connection.end();
}

// Exemple d'insertion d'utilisateurs
async function main() {
    await insertUser('aris', 'admin');
    await insertUser('jonathan', 'admin');
    console.log('Utilisateurs insérés avec succès.');
}

main().catch(console.error);
