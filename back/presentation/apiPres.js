require('dotenv').config();

const express = require("express");
const business = require("../business/business");
const cors = require("cors");
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require("mysql2/promise");


const apiServ = {
    start: function (port) {

        const corsOptions = {
            origin: 'http://localhost:3000',
            credentials: true // Permet l'envoi des credentials comme les cookies
        };

        app.use(bodyParser.json());
        // app.use(cookieParser());

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

        // Route pour la connexion
        app.post('/api/login', async (req, res) => {
            try {
                const { pseudoKP, passwordKP } = req.body;
                const result = await business.login(pseudoKP, passwordKP);

                res.json({ success: true, message: 'Connexion Réussie. Bienvenue sur KeepPass !', data: result });
                console.log('result', result);
            } catch (error) {
                res.status(500).json({ success: false, message: 'Erreur lors de la connexion', error: error.message });
            }
        });
        

        // Route pour obtenir les mots de passe de l'utilisateur connecté
        app.post('/api/passwords', async (req, res) => {
            try {
                const pseudoKP = req.body.pseudoKP; //Réccupération de l'ID de l'utilisateur connecté
                console.log('pseudoKP:', pseudoKP);

                const rows = await business.getPasswords(pseudoKP);
                res.json(rows);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erreur du serveur' });
            }
        });

        app.post('/api/addPassword', async (req, res) => {
            try {
                const { website, pseudo, password, pseudoKP} = req.body;
                console.log("website", website);    
                console.log("pseudo", pseudo);    
                console.log("password", password);    
                console.log("pseudoKP", pseudoKP);    

                const result = await business.addPassword(pseudoKP, website, pseudo, password);
                res.json({ success: true, message: 'Mot de passe ajouté avec succès', data: result });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Erreur du serveur', error: error.message });
            }
        });


        // Route pour supprimer un mot de passe
        app.delete('/api/passwords/:id', async (req, res) => {
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

        app.put('/api/passwords', async (req, res) => {
            try {
                //Récupération des informations dans le body
                const { pseudoKP, website, pseudo, password } = req.body;

                console.log(pseudoKP, website, pseudo, password);
        
                if (!pseudoKP) {
                    return res.status(400).json({ message: 'Pseudo utilisateur requis' });
                }
        
                const result = await business.editPassword(pseudoKP, website, pseudo, password);
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
