const axios = require('axios');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// On utilise l'API HaveIBeenPwned pour vérifier si le mot de passe a été exposé
async function verifierSiExpose(motDePasse) {
  const sha1 = require('crypto').createHash('sha1').update(motDePasse).digest('hex').toUpperCase();
  const prefix = sha1.substring(0, 5);
  const suffix = sha1.substring(5);

  try {
    const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
    const hashes = response.data.split('\n');
    return hashes.some(h => h.split(':')[0] === suffix);
  } catch (error) {
    console.error('Erreur lors de la vérification avec HIBP:', error);
    return true; // Retourner true en cas d'erreur
  }
}

rl.question('Veuillez entrer votre mot de passe pour vérification : ', async (motDePasse) => {
    const expose = await verifierSiExpose(motDePasse);
    const resultat = verifierMotDePasse(motDePasse, expose);
    console.log(resultat);
    rl.close();
});

function verifierMotDePasse(motDePasse, expose) {
    if (expose) {
        return "Ce mot de passe a été exposé dans des violations de données précédentes. Veuillez en choisir un autre.";
    }

     // Logique de force du mdp
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
