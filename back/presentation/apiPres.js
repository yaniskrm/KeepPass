var express = require("express");
const business = require("../business/business");
var cors = require("cors");
var app = express();


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


            jsonRes = business.addCustomers(userJSON);

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

        app.listen(port, function () {
            console.log("Server running on port " + port);
        });

    }
}

module.exports = apiServ;