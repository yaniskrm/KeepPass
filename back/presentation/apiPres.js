require('dotenv').config();
var express = require("express");
const business = require("../business/business");
var cors = require("cors");
var app = express();
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');

const apiServ = {
    start: function (port) {

        const dbConfig = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD
        };

        console.log(dbConfig);

        const corsOptions = {
            origin: 'http://localhost:3000', // Spécifiez l'origine autorisée
            credentials: true // Permet l'envoi des credentials comme les cookies
          };
        
        app.use(session({
            secret: 'secret',
            resave: false,
            saveUninitialized: false,
            cookie: { secure: false } 
        }));

        app.use(express.json());

        app.use(cors());
        app.use(cors(corsOptions));

        app.use(bodyParser.urlencoded({ extended: true }));

        // Route pour la création d'utilisateur
        app.post('/api/createuser', async (req, res) => {
            try {
                // Récupérer les données de la requête pseudoKP et passwordKP
                const { pseudoKP, passwordKP } = req.body;


                const result = await business.createUser(pseudoKP, passwordKP);
                res.json({ success: true, message: 'Utilisateur créé avec succès', data: result });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Erreur lors de la création de l\'utilisateur', error: error.message });
            }
        });        
        
        app.post('/api/login', async (req, res) => {
            const { pseudo, password } = req.body;
            console.log(req.body)
            try {
                // connexion avec la base de données
                const connection = await mysql.createConnection(dbConfig);
                // console.log('Pseudo:', pseudo, 'Password:', password);

                // Chercher l'utilisateur par pseudo
                const [users] = await connection.execute('SELECT * FROM UserKP WHERE pseudoKP = ?', [pseudo]);
                
                // Vérifier si un utilisateur a été trouvé
                if (users.length > 0) {
                    const user = users[0];

                    // Comparer le mot de passe fourni avec le mot de passe haché dans la base de données
                    const match = await bcrypt.compare(password, user.passwordKP);
                    if (match) {
                        // Si les mots de passe correspondent
                        //renvoie vers la page index.html
                        req.session.userId = user.idUserKP; // Stocker l'ID dans la session
                        req.session.pseudo = user.pseudoKP;
                        res.redirect('http://localhost:3000/accueil/accueil.html');
                    } else {
                        // Si les mots de passe ne correspondent pas  
                        res.send('Échec de la connexion : mot de passe incorrect');
                    }
                } else {
                    // Si aucun utilisateur n'a été trouvé avec ce pseudo
                    res.send('Échec de la connexion : utilisateur non trouvé');
                }
        
                // Fermer la connexion avec la base de données
                await connection.end();
            } catch (error) {
                console.error('Erreur de connexion à la base de données', error);
                res.status(500).send('Erreur lors de la connexion au serveur');
            }
        });
        
        
          
        app.get('/api/user', (req, res) => {
            if (req.session && req.session.userId) {
                res.json({ pseudo: req.session.pseudo, userId: req.session.userId });
            } else {
                res.status(401).json({ message: "Non authentifié" });
            }
            });
        
        app.get('/logout', (req, res) => {
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).send('Failed to log out');
                }
        
                // Optionnel: Supprimer explicitement le cookie      session du côté client
                res.clearCookie('connect.sid'); // Assurez-vous que le nom du cookie est correct selon votre configuration
        
                // Rediriger vers la page de connexion ou renvoyer un succès
                //res.redirect('/login'); // Modifiez selon le chemin de votre page de connexion
                res.redirect('http://localhost:3000/accueil/accueil.html');
                // ou
                // res.status(200).send('Logged out');
            });
        });


        // // Route pour la liste des mots de passe
        // app.get('/api/listPassword', async (req, res) => {
        //     if (!req.session.userId) {
        //         return res.status(401).json({ success: false, message: 'Utilisateur non authentifié' });
        //     }
        //     try {
        //         const userId = req.session.userId;
        //         const passwords = await business.listPasswords(userId);
        //         res.json({ success: true, passwords });
        //     } catch (error) {
        //         res.status(500).json({ success: false, message: 'Erreur lors de la récupération des mots de passe', error: error.message });
        //     }
        // });


        //  // Route pour chiffrer et stocker un mot de passe
        //  app.post('/api/encrypt', async (req, res) => {
        //     try {
        //         const { pseudoKP, site, password } = req.body;
        //         const result = await business.encryptAndStorePassword(pseudoKP, site, password);
        //         res.json({ success: true, message: 'Mot de passe chiffré et stocké avec succès', data: result });
        //     } catch (error) {
        //         res.status(500).json({ success: false, message: 'Erreur lors du chiffrement et du stockage du mot de passe', error: error.message });
        //     }
        // });

        // // Route pour déchiffrer et récupérer les mots de passe
        // app.post('/api/decrypt', async (req, res) => {
        //     try {
        //         const { pseudoKP, site } = req.body;
        //         const result = await business.decryptAndRetrievePassword(pseudoKP, site);
        //         res.json({ success: true, message: 'Mot de passe déchiffré avec succès', data: result });
        //     } catch (error) {
        //         res.status(500).json({ success: false, message: 'Erreur lors du déchiffrement du mot de passe', error: error.message });
        //     }
        // });

        app.listen(port, function () {
            console.log("Server running on port " + port);
        });
    }
}

module.exports = apiServ;