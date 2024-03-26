const fs = require("fs");
const mysql = require("mysql");

//fichier client
const filename = "./data/customers.json";


let rawdata = fs.readFileSync(filename, "utf8");
let objectClient = JSON.parse(rawdata);

const currentDate = new Date();

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
    },

    getAllCustomers: function () {
        //read json file
        const data = fs.readFileSync(filename);

        //parse to object
        const customers = JSON.parse(data);

        //return customers
        return customers;
    },

    getCustomers: function (number, page) {
        {
            //read json file
            let rawdata = fs.readFileSync(filename);

            //parse to object
            let customers = JSON.parse(rawdata);

            const total = customers.length;

            //filter by number and page
            if (number && page) {
                customers = customers.slice((page - 1) * number, page * number);
            }

            const result = {
                total: total,
                result: customers
            };

            return result;
        }
    },

    removeCustomer: function (foundCustomer, customers) {

        const index = customers.indexOf(foundCustomer);
        customers.splice(index, 1);
        fs.writeFileSync(filename, JSON.stringify(customers)); //on réécrit le fichier sans les données supprimées
        return foundCustomer;
    },

    editCustomer: function (editClient, foundCustomer) {
        
        if((editClient.first != foundCustomer.first) && (editClient.first)){
            foundCustomer.first = editClient.first;
        }
        if(editClient.last != foundCustomer.last && (editClient.last)){
            foundCustomer.last = editClient.last;
        }
        if(editClient.company != foundCustomer.company && (editClient.company)){
            foundCustomer.company = editClient.company;
        }
        if(editClient.country != foundCustomer.country && (editClient.country)){
            foundCustomer.country = editClient.country;
        }
        if(editClient.email != foundCustomer.email && (editClient.email)){
            foundCustomer.email = editClient.email;
        }

       //on cherche l'index du client à modifier
       var indexCustomer = objectClient.findIndex(customer => customer.id === foundCustomer.id);

       //on remplace le client par le client modifié
       objectClient[indexCustomer] = foundCustomer;

        
        // enregistrer les modifications dans le fichier JSON
        fs.writeFileSync(filename, JSON.stringify(objectClient), (error) => {
            if(error) throw error;
        });
        return objectClient;
        
    }
};

module.exports = datalayer;