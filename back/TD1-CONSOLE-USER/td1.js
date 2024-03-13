const fs = require("fs");
const proc = require("process");
const readline = require("readline-sync");
const chalk = require("chalk");

let rawdata = fs.readFileSync("users.json");//on lit de manière asynchrone le fichier users.json

let user = JSON.parse(rawdata)//crée un objet contenant les lignes lues (je suppose)

let res = {}
let arrRes = []


/**
 * Fonction retournant la valeur choisi dans le menu par l'utilisateur
 */

function displayMenu(){
    var choice = readline.question('1: Country\n2: Company\n----------------\n3: Quitter \n'); //lecture du choix de l'utilisateur
    return choice;
}

//on vide les tableaux
function emptyTabs(){
    res = {};
    arrRes = []; 
}


/**
 * Remplir le tableau de resultats avec les valeurs de country
 */

function fillArrResCountry(){
    emptyTabs();
    console.log(user.length);
    for (let i = 0; i < user.length; i++) {
        var nomPays = user[i].country//on récupère le nom du pays
        if (!res[nomPays]) { //si nomPays n'appartient pas à res, 
            res[nomPays] = 1//on définit l'indice du pays à 1
        }
        else//sinon
            res[nomPays]++;//on incrémente
    }
    for (let i in res) {//on parcours res
        arrRes.push(i, res[i])//on ajoute à arrRes  le pays et son nombre d'occurence
    }
}


/**
 * Remplir le tableau de resultats avec les valeurs de company
 */

function fillArrResCompany(){
    emptyTabs();
    for (i = 0; i < user.length; i++) {
        var nomCompanie = user[i].company//on récupère le nom de la compagnie
        if (!res[nomCompanie]) { //si nomPays n'appartient pas à res,
            res[nomCompanie] = 1//on définit l'indice du pays à 1
        }
        else//sinon
            res[nomCompanie]++//on incrémente
    }
    for (let i in res) {//on parcours 
        arrRes.push(i, res[i])//on ajoute à arrRes  la compagnie et son nombre d'occurence
    }
}



/**
 * Affichage du tableau de résultats trié dans l'ordre décroissant
 */
function displayArrRes(){
    console.log(arrRes) //on affiche le tableau
}

function main(){
    let choice = 0;
    while(choice != 3){
        choice = displayMenu();
        if(choice == '1'){ //si entrée est 1, on exécute le code suivant pour afficher les country
            fillArrResCountry();
        }
    
        if(choice == '2'){ //si entrée est company, on exécute le code suivant pour afficher les company
            fillArrResCompany();
        }


        displayArrRes();
    }
}


main();