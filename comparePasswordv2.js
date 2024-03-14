const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Veuillez entrer votre mot de passe pour vérification : ', (motDePasse) => {
    const resultat = verifierMotDePasse(motDePasse);
    console.log(resultat);
    rl.close();
});

function verifierMotDePasse(motDePasse) {
    // Critères flexibles pour un mot de passe fort
    const longueurMinimale = 12;
    const longueurForte = 20; // Longueur à partir de laquelle d'autres critères peuvent être assouplis
    const complexite = /[A-Z]/.test(motDePasse) && /[a-z]/.test(motDePasse) && /[0-9]/.test(motDePasse);
    const complexiteAvecSymboles = complexite && /[\W_]/.test(motDePasse);
    
    // Logique flexible
    if (motDePasse.length >= longueurForte) {
        return "Votre mot de passe est considéré comme fort de par sa longueur.";
    } else if (motDePasse.length >= longueurMinimale && complexiteAvecSymboles) {
        return "Votre mot de passe est fort grâce à sa complexité et sa longueur.";
    } else if (motDePasse.length >= longueurMinimale && complexite) {
        return "Votre mot de passe est assez fort, mais l'ajout de symboles le renforcerait.";
    } else {
        return "Votre mot de passe n'est pas assez fort. Assurez-vous qu'il respecte mieux les critères énoncés.";
    }
}
