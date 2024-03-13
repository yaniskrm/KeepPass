const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Configuration de la connexion à la base de données
const dbConfig = {
    host: 'localhost',
    user: 'root',
    database: 'KeepPass',
    password: 'root'
};

// Fonction pour hacher un mot de passe
async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// Fonction pour insérer un utilisateur dans la base de données
async function insertUser(pseudoKP, passwordKP) {
    const connection = await mysql.createConnection(dbConfig);
    const hashedPassword = await hashPassword(passwordKP);
    await connection.execute(
        'INSERT INTO UserKP (pseudoKP, passwordKP) VALUES (?, ?)',
        [pseudoKP, hashedPassword]
    );
    await connection.end();
}

// Exemple d'utilisation : insérer des utilisateurs
async function main() {
    await insertUser('utilisateur1', 'motdepasse1');
    await insertUser('utilisateur2', 'motdepasse2');
    console.log('Utilisateurs insérés avec succès.');
}

main().catch(console.error);
