const dal = require("../data/datalayer");

const defaultNumber = 10;
const defaultPage = 1;
const maxNumber = 100;

const business = {
    getAllCustomers: function () {
        return dal.getAllCustomers();
    },

    getCustomers: function (number, page) {
        //checks param
        if (number === undefined || page === undefined) {
            number = defaultNumber;
            page = defaultPage;
        }
        if (number > maxNumber) {
            number = maxNumber;
        }

        //recupérer données de la DAL
        const resCustomers = dal.getCustomers(number, page);

        resCustomers.page = page;
        resCustomers.numberByPage = number;
        resCustomers.totalPages = Math.ceil(resCustomers.total / number);

        return resCustomers;
    },

    addCustomers: function (customerJSON) {
        console.log("customerJSON", customerJSON);
         //vérifie si tous les champ sont remplis ou definis
         if (customerJSON.first === undefined || customerJSON.last === undefined || customerJSON.company === undefined || customerJSON.country === undefined || customerJSON.email === undefined
            || customerJSON.first === "" || customerJSON.last === "" || customerJSON.company === "" || customerJSON.country === "" || customerJSON.email === "") {
            //envoie un message d'erreur
            console.log("tout les champs n'ont pas été remplis"); //RETOUR DE CODE ERREUR AVEC CODE QUI ACCOMPAGNE CETTE ERREUR
            return {status : 400, message : "tout les champs n'ont pas été remplis"};
        }
        
        const newCustomers = dal.addCustomers(customerJSON);
        return newCustomers;
    },

    removeCustomer: function (idClient) {
        //vérifie si l'id est bien un nombre
        if (isNaN(idClient)) {          
            //Retourne un code erreur avec un code qui accompagne cette erreur
            console.log("L'id n'est pas un nombre"); 
            return {status : 400, message : "L'id n'est pas un nombre"};
        }

        //récupère tous les clients du tableau json actuel
        const customers = dal.getAllCustomers();
        console.log("customers", customers);

        //trouve le client avec l'id choisit
        const foundCustomer = customers.find(customer => customer.id == idClient);

        //supprime le client du tableau
        if (foundCustomer) {
            dal.removeCustomer(foundCustomer, customers);
            return {status : 200, message : "Le client a bien été supprimé"};
        }
        else {
            //envoie un message d'erreur
            console.log("Ce client n'existe pas"); //RETOUR DE CODE ERREUR AVEC CODE QUI ACCOMPAGNE CETTE ERREUR
            return {status : 400, message : "Ce client n'existe pas"};
        }
    },

    editCustomer: function(editClient) {
        //vérifie si l'id est bien un nombre
        if (isNaN(editClient.id)) {          
            //Retourne un code erreur avec un code qui accompagne cette erreur
            console.log("L'id n'est pas un nombre"); 
            return {status : 400, message : "L'id n'est pas un nombre"};
        }

        //récupère tous les clients du tableau json actuel
        const customers = dal.getAllCustomers();

        //trouve le client avec l'id choisit
        const foundCustomer = customers.find(customer => customer.id == editClient.id);

        //modifie le client du tableau
        if (foundCustomer) {
            dal.editCustomer(editClient, foundCustomer);
            return {status : 200, message : "Le client a bien été modifié"};
        }
        else {
            //envoie un message d'erreur
            console.log("Ce client n'existe pas"); //RETOUR DE CODE ERREUR AVEC CODE QUI ACCOMPAGNE CETTE ERREUR
            return {status : 400, message : "Ce client n'existe pas"};
        }
    }

};

module.exports = business;