// script.js

function resetResult() {
    document.getElementById('resultat').textContent = '';
    document.getElementById('password-strength').textContent = '';
    toggleVisibility();
    
}

function toggleVisibility() {
    var resultatElement = document.getElementById('resultat');
    var strengthElement = document.getElementById('password-strength');

    if (!resultatElement.textContent) {
        resultatElement.style.display = 'none';
    } else {
        resultatElement.style.display = 'block';
    }

    if (!strengthElement.textContent) {
        strengthElement.style.display = 'none';
    } else {
        strengthElement.style.display = 'block';
    }
}

function changePasswordVisibility() {
    var passwordInput = document.getElementById('password');
    var icon = document.querySelector('.password-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.textContent = 'visibility';
    } else {
        passwordInput.type = 'password';
        icon.textContent = 'visibility_off';
    }
}

// Fonction pour vérifier si un mot de passe a été exposé dans des fuites de données précédentes
async function verifierMotDePasse() {
    resetResult();
    var motDePasse = document.getElementById('password').value;
    var resultatElement = document.getElementById('resultat');
    var strengthElement = document.getElementById('password-strength');

    if (!motDePasse) {
        resultatElement.textContent = 'Veuillez saisir un mot de passe.';
        toggleVisibility();
        return;
    }

    var hashed = await sha1(motDePasse);
    var prefix = hashed.substring(0, 5);
    var suffix = hashed.substring(5).toUpperCase();

    try {
        var response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        var hashes = (await response.text()).split('\n');
        var estExpose = hashes.some(h => h.split(':')[0] === suffix);
        
        if (estExpose) {
            resultatElement.textContent = "Ce mot de passe a été exposé dans des fuites de données précédentes. Veuillez en choisir un autre.";
        } else {
            strengthElement.textContent = evalueForceMotDePasse(motDePasse);
        }
    } catch (error) {
        console.error('Erreur lors de la vérification avec HIBP:', error);
        resultatElement.textContent = 'Erreur lors de la vérification. Veuillez réessayer plus tard.';
    }
    toggleVisibility();
}

function hideEmptyElements() {
    document.getElementById('resultat').style.display = 'none';
    document.getElementById('password-strength').style.display = 'none';
}


// Fonction pour évaluer la force d'un mot de passe
function evalueForceMotDePasse(motDePasse) {
    const longueur = motDePasse.length;
    const complexiteAvecSymboles = /[A-Z]/.test(motDePasse) && /[a-z]/.test(motDePasse) && /[0-9]/.test(motDePasse) && /[\W_]/.test(motDePasse);
    const complexiteSansSymboles = /[A-Z]/.test(motDePasse) && /[a-z]/.test(motDePasse) && /[0-9]/.test(motDePasse);

    if (longueur >= 12 && complexiteAvecSymboles) {
        return "Votre mot de passe est extrêmement fort.";
    } else if (longueur >= 14 && complexiteSansSymboles) {
        return "Votre mot de passe est très fort.";
    } else {
        return "Votre mot de passe n'est pas assez fort selon les standards modernes de sécurité.";
    }
}

// Fonction pour calculer un hash SHA-1 en utilisant l'API de crypto Web
async function sha1(motDePasse) {
    const encoder = new TextEncoder();
    const data = encoder.encode(motDePasse);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}
