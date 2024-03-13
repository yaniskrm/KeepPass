const apiServ = require("./presentation/apiPres");
const consolePres = require("./presentation/consolePres");
const port = 3001;

function main() {

    //Starts api server
    apiServ.start(port);
    consolePres.start();
}

main();



//lien consigne
// https://docs.google.com/forms/d/e/1FAIpQLSfOtvwDBmClRs1BVI-pedSO3A21sXp1mnGJt1_PCf1vwObb1g/viewform?usp=sf_link

