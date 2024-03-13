const readline = require('readline');
const readlinesync = require('readline-sync');
const chalk = require('chalk');
const business = require("../business/business");

const consolePres = {
    start: async function () {



        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        console.log(chalk.red("Bienvenue dans l'application de gestion de clients"));
        console.log(chalk.blue("1. Lister les Clients"));
        console.log(chalk.blue("2. Ajouter un client"));
        console.log(chalk.blue("3. Supprimer un client"));
        console.log(chalk.blue("4. Modifier un client"));
        console.log(chalk.red("5. Quitter l'application"));

        const answer = await new Promise(resolve => {
            rl.question("Choisissez une option: ", resolve);
            });

            rl.close();

            if (answer == "1") {
                var customer = business.getCustomers();
                console.log(customer.result);
                this.start();
    
            }
            if (answer == "2") {
                //on demande les informations du client
                console.log("Veuillez entrer les informations du client : \n");
                var first = readlinesync.question("Prénom : ");
                var last = readlinesync.question("Nom : ");
                var email = readlinesync.question("Email : ");
                var company = readlinesync.question("Entreprise : ");
                var country = readlinesync.question("Pays : ");
    
    
                var customer = {
                    "id": null, "email": email, "first": first, "last": last,
                    "company": company, "created_at": null, "country": country
                };
    
                business.addCustomers(customer);
                this.start();
            }
            if (answer == "3") {
                console.log("Veuillez entrer l'id du client à supprimer : \n");
                var id = readlinesync.question("Id : ");
                business.removeCustomer(id);
                this.start();
            }
            if (answer == "4") {
                //on demande les informations du client à modifier  
                console.log("Veuillez entrer la / les nouvelle(s) information(s) du client : \n");
                var id = readlinesync.question("Id : ");
                var first = readlinesync.question("Prénom : ");
                var last = readlinesync.question("Nom : ");
                var email = readlinesync.question("Email : ");
                var company = readlinesync.question("Entreprise : ");
                var country = readlinesync.question("Pays : ");
    
                var customer = {
                    "id": id, "email": email, "first": first, "last": last,
                    "company": company, "created_at": null, "country": country
                };
    
                business.editCustomer(customer);
                this.start();
            }
            if (answer == "5") {
                console.log("Au revoir !");
                process.exit();
            }
        
    }
}

module.exports = consolePres;