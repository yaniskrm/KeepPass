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
    // Logique ajustée selon l'image partagée
    const complexiteAvecSymboles = /[A-Z]/.test(motDePasse) && /[a-z]/.test(motDePasse) && /[0-9]/.test(motDePasse) && /[\W_]/.test(motDePasse);
    const complexiteSansSymboles = /[A-Z]/.test(motDePasse) && /[a-z]/.test(motDePasse) && /[0-9]/.test(motDePasse);

    if (motDePasse.length >= 15 && complexiteAvecSymboles) {
        return "Votre mot de passe est extrêmement fort et ne devrait pas être craqué avant des milliards d'années.";
    } else if (motDePasse.length >= 17 && complexiteSansSymboles) {
        return "Votre mot de passe est très fort et ne devrait pas être craqué avant des centaines d'années.";
    } else {
        return "Votre mot de passe n'est pas assez fort selon les standards modernes de sécurité. Considérez l'utilisation de plus de caractères et de symboles pour améliorer sa force.";
    }
}
