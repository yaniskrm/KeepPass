require('dotenv').config();

const express = require("express");
const business = require("../business/business");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const mysql = require("mysql2/promise");

// Middleware pour vérifier la session de l'utilisateur
function checkAuthenticated(req, res, next) {
    if (req.session) {
        return next();
    }
    res.status(401).json({ message: 'Utilisateur non authentifié' });
}

const apiServ = {
    start: function (port) {

        const corsOptions = {
            origin: 'http://localhost:3000', 
            credentials: true // Permet l'envoi des credentials comme les cookies
        };

        app.use(bodyParser.json());
        app.use(cookieParser());

        app.use(session({
            secret: 'your_secret_key', 
            resave: false,
            saveUninitialized: true,
            cookie: { secure: false, httpOnly: true }
        }));

        app.use(cors(corsOptions));
        app.use(bodyParser.urlencoded({ extended: true }));

        // Middleware pour ajouter les cookies à la réponse
        app.use((req, res, next) => {
            if (req.session && req.session.pseudoKP) {
                res.cookie('pseudoKP', req.session.pseudoKP, { httpOnly: true, secure: false });
                res.cookie('userId', req.session.userId, { httpOnly: true, secure: false });
            }
            next();
        });

        app.use(express.json());

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
            try {
                const { pseudoKP, passwordKP } = req.body;
                const result = await business.login(pseudoKP, passwordKP);
                req.session.userId = result.idUserKP; // Stocker l'ID dans la session
                req.session.pseudoKP = result.pseudoKP; // Stocker le pseudo dans la session
                console.log('Session après login:', req.session); // Log de la session après login
                res.json({ success: true, message: 'Connexion Réussie. Bienvenue sur KeepPass !', data: result });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Erreur lors de la connexion', error: error.message });
            }
        });

        app.get('/api/userCookies', (req, res) => {
            if (req.session && req.session.userId) {
                res.json({ pseudo: req.session.pseudoKP, userId: req.session.userId });
            } else {
                res.status(401).json({ message: "Non authentifié" });
            }
        });

        // app.get('/logout', (req, res) => {
        //     req.session.destroy((err) => {
        //         if (err) {
        //             return res.status(500).send('Failed to log out');
        //         }

        //         // Optionnel: Supprimer explicitement le cookie session du côté client
        //         res.clearCookie('connect.sid'); // Assurez-vous que le nom du cookie est correct selon votre configuration

        //         // Rediriger vers la page de connexion ou renvoyer un succès
        //         res.redirect('http://localhost:3000/accueil/accueil.html');
        //     });
        // });

        // Route pour obtenir les mots de passe de l'utilisateur connecté
        app.get('/api/passwords', checkAuthenticated, async (req, res) => {
            try {
                console.log('Session avant récupération des mots de passe:', req.session); // Log de la session avant récupération
                //const userId = req.session.userId; // Assurez-vous que l'ID utilisateur est stocké dans la session
                userId = 1;
                const rows = await business.getPasswords(userId);
                res.json(rows);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erreur du serveur' });
            }
        });

        // Route pour supprimer un mot de passe
        app.delete('/api/passwords/:id', checkAuthenticated, async (req, res) => {
            try {
                const passwordId = req.params.id;
                const userId = req.session.userId;
                
                const result = await business.deletePassword(userId, passwordId);
                res.json({ success: true, message: 'Mot de passe supprimé avec succès', data: result });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erreur du serveur', error: error.message });
            }
        });

        // Route pour modifier un mot de passe
        app.put('/api/passwords/:id', checkAuthenticated, async (req, res) => {
            try {
                const passwordId = req.params.id;
                const userId = req.session.userId;
                const { website, pseudo, password } = req.body;

                const result = await business.updatePassword(userId, passwordId, website, pseudo, password);
                res.json({ success: true, message: 'Mot de passe modifié avec succès', data: result });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erreur du serveur', error: error.message });
            }
        });

        app.listen(port, function () {
            console.log("Server running on port " + port);
        });
    }
}

module.exports = apiServ;
