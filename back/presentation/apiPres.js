var express = require("express");
const business = require("../business/business");
var cors = require("cors");
var app = express();
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');//const mysql = require('mysql');
//const db = mysql.createConnection({   host: "localhost",   user: "jonathan",   password: "mot_de_passe_utilisateur" });



const apiServ = {
    start: function (port) {

        app.use(express.json());

        app.use(cors());

        //retourne un tableau json contenant les clients et des informations supplémentaires 
        // (nombre de page, nombre de client total)
        app.get("/api/customers", function (req, res) { 

            const number = req.query.number;
            const page = req.query.page;

            // get customers from business layer
            const resCustomers = business.getCustomers(number, page);

            res.json(resCustomers);
        });

        //add customers to json file
        app.post("/api/createuser", function (req, res) { //post envoie qqc

            var userJSON = {
                "id": null, "pseudoKP": req.body.pseudoKP, "passwordKP": req.body.passwordKP
            };


            jsonRes = business.createUser(userJSON);

            if (jsonRes.status === 400) {
                res.status(400).send(jsonRes.message);
            } else {
                res.json(jsonRes);
            }
        });

        //remove customers from json file
        app.delete("/api/removecustomer", function (req, res) { //post envoie qqc
            var idClient = req.query.id;

            jsonRes = business.removeCustomer(idClient);

            //affiche le message de retour
            if (jsonRes.status === 400) {
                res.status(400).send(jsonRes.message);
            } else {
                res.json(jsonRes);
            }
        });

        app.put("/api/editcustomer", function (req, res) { //put modifie valeur json

            var editClient = req.body;

            jsonRes = business.editCustomer(editClient);

            if (jsonRes.status === 400) {
                res.status(400).send(jsonRes.message);
            }
            else {
                res.json(jsonRes);
            }
        });

        // PARTIE KEEPPASS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        
        app.use(bodyParser.urlencoded({ extended: true }));

        const dbConfig = {
            host: "localhost",
            user: "aris",
            database: "KeepPass",
            password: "toor"
        };

        app.post('/login', async (req, res) => {
            const { pseudo, password } = req.body;
            console.log(req.body)
            try {
                // connexion avec la base de données
                const connection = await mysql.createConnection(dbConfig);
                console.log('Pseudo:', pseudo, 'Password:', password);

                // Chercher l'utilisateur par pseudo
                const [users] = await connection.execute('SELECT * FROM UserKP WHERE pseudoKP = ?', [pseudo]);
                
                // Vérifier si un utilisateur a été trouvé
                if (users.length > 0) {
                    const user = users[0];
        
                    // Comparer le mot de passe fourni avec le mot de passe haché dans la base de données
                    const match = await bcrypt.compare(password, user.passwordKP);
                    if (match) {
                        // Si les mots de passe correspondent
                        res.send('Connexion réussie');
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

        app.listen(port, function () {
            console.log("Server running on port " + port);
        });

    }
}

module.exports = apiServ;