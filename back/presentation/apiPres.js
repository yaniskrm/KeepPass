require('dotenv').config();
var express = require("express");
const business = require("../business/business");
var cors = require("cors");
var app = express();
const bodyParser = require('body-parser');

const apiServ = {
    start: function (port) {


        
        // app.use(session({
        //     secret: 'secret',
        //     resave: false,
        //     saveUninitialized: false,
        //     cookie: { secure: false } 
        // }));

        app.use(express.json());

        app.use(cors());

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
            try {
                const pseudo = req.body.pseudo;
                const password = req.body.password;

                const result = await business.login(pseudo, password);
                
                res.json(result);
            } catch (error) {
                console.error('Erreur de connexion à la base de données', error);
                res.status(500).json({ error: 'Erreur lors de la connexion au serveur' });
            }
        });
        
        // const corsOptions = {
        //     origin: 'http://localhost:3000', // Spécifiez l'origine autorisée
        //     credentials: true // Permet l'envoi des credentials comme les cookies
        //   };
          
        // app.use(cors(corsOptions));

        // app.get('/api/user', (req, res) => {
        //     if (req.session && req.session.userId) {
        //         res.json({ pseudo: req.session.pseudo, userId: req.session.userId });
        //     } else {
        //         res.status(401).json({ message: "Non authentifié" });
        //     }
        //     });

        app.listen(port, function () {
            console.log("Server running on port " + port);
        });
    }
}

module.exports = apiServ;