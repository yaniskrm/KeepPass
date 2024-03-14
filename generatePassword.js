const crypto = require('crypto');

function genererMotDePasseFort(options = {}) {
  // Options par défaut
  const {
    longueur = 12,
    inclureMajuscules = true,
    inclureMinuscules = true,
    inclureChiffres = true,
    inclureSymboles = true
  } = options;

  // S'assurer que la longueur est au moins de 12
  const longueurFinale = Math.max(longueur, 12);

  // Constituer la chaîne de caractères selon les options
  let caracteres = '';
  if (inclureMajuscules) caracteres += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (inclureMinuscules) caracteres += 'abcdefghijklmnopqrstuvwxyz';
  if (inclureChiffres) caracteres += '0123456789';
  if (inclureSymboles) caracteres += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

  // Générer le mot de passe
  let motDePasse = '';
  for (let i = 0; i < longueurFinale; i++) {
    const indexAleatoire = crypto.randomInt(0, caracteres.length);
    motDePasse += caracteres[indexAleatoire];
  }

  return motDePasse;
}

// Exemple d'utilisation
console.log(genererMotDePasseFort({
  longueur: 16, // Spécifier la longueur souhaitée
  inclureMajuscules: true, // Inclure des lettres majuscules
  inclureMinuscules: true, // Inclure des lettres minuscules
  inclureChiffres: true, // Inclure des chiffres
  inclureSymboles: true // Inclure des symboles
}));


console.log("Test 1: Mot de passe de base (16 caractères, tous types inclus)");
console.log(genererMotDePasseFort({ longueur: 16 }));

console.log("\nTest 2: Mot de passe seulement avec des chiffres (12 caractères)");
console.log(genererMotDePasseFort({
  longueur: 12,
  inclureMajuscules: false,
  inclureMinuscules: false,
  inclureChiffres: true,
  inclureSymboles: false
}));

console.log("\nTest 3: Mot de passe avec majuscules et minuscules uniquement (20 caractères)");
console.log(genererMotDePasseFort({
  longueur: 20,
  inclureMajuscules: true,
  inclureMinuscules: true,
  inclureChiffres: false,
  inclureSymboles: false
}));

