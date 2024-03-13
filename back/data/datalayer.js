const fs = require("fs");

//fichier client
const filename = "./data/customers.json";


let rawdata = fs.readFileSync(filename, "utf8");
let objectClient = JSON.parse(rawdata);

const currentDate = new Date();

var numberCustomer;


let datalayer = {
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



    //ecriture nouveau customer

    addCustomers: function (customerJSON) {

        //Définition de l'id du nouveau client
        const getNewId = objectClient => Math.max(...objectClient.map(customer => customer.id)) + 1;
        numberCustomer = getNewId(objectClient);
        customerJSON.id = numberCustomer;

        //définition de la date d'ajout du nouveau client
        customerJSON.created_at = currentDate;

        //ajouter customerJSON à objectClient
        objectClient.push(customerJSON);

        fs.writeFileSync(filename, JSON.stringify(objectClient));

        return customerJSON;
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