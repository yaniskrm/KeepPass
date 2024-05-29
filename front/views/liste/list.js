document.addEventListener("DOMContentLoaded", function () {
    fetchPasswords();
});

// Function to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function fetchPasswords() {
    const pseudoKP = getCookie("pseudoKP"); // Récupération du pseudo de l'utilisateur connecté depuis le cookie
    if (!pseudoKP) {
        console.error("Vous n'êtes pas connecté !");
        document.getElementById("listPasswords").innerHTML = "<div class='header text-center mb-5'><h1>Connectez vous afin de consulter vos mots de passe !</h1></div>";
        return;
    }

    fetch('http://localhost:3001/api/passwords', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pseudoKP: pseudoKP }), // Envoyer le pseudoKP dans le corps de la requête
        credentials: 'include'
    })
    .then(response => response.json())
    .then(data => {
        if (data.length === 0) {
            document.getElementById("listPasswords").innerHTML = "<div class='header text-center mb-5'><h1>Aucun mot de passe enregistré pour cet utilisateur !</h1></div>";
            return;
        }
        // Traitement de la réponse
        data.forEach(passwordInfo => {
            // Accès aux données pour chaque mot de passe
            const website = passwordInfo.website;
            const pseudo = passwordInfo.pseudo;
            const password = passwordInfo.password;

            fillTableUserInfos(website, pseudo, password);
        });
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des mots de passe:', error);
    });
}

function fillTableUserInfos(website, pseudo, password) {
    // Sélectionner le corps du tableau
    const tableBody = document.getElementById("passwordTableBody");

    // Créer une nouvelle ligne pour le tableau
    const newRow = document.createElement("tr");

    // Créer les cellules pour chaque colonne
    const websiteCell = document.createElement("td");
    websiteCell.textContent = website;

    const pseudoCell = document.createElement("td");
    pseudoCell.textContent = pseudo;

    const passwordCell = document.createElement("td");
    passwordCell.textContent = password;

    const actionsCell = document.createElement("td");

    // Créer le bouton "Modifier"
    const editButton = document.createElement("button");
    editButton.textContent = "Modifier";
    editButton.classList.add("btn", "btn-warning", "btn-sm", "me-1");
    editButton.addEventListener("click", function() {
        // Stocker les informations dans le localStorage
        localStorage.setItem('editWebsite', website);
        localStorage.setItem('editPseudo', pseudo);
        localStorage.setItem('editPassword', password);

        // Rediriger vers le formulaire de modification
        window.location.href = `http://localhost:3000/liste/edit/editInfosForm.html`;
    });

    // Créer le bouton "Supprimer"
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Supprimer";
    deleteButton.classList.add("btn", "btn-danger", "btn-sm");
    deleteButton.addEventListener("click", function() {
        deletePassword(website);
    });

    // Ajouter les boutons à la cellule "Actions"
    actionsCell.appendChild(editButton);
    actionsCell.appendChild(deleteButton);

    // Ajouter les cellules à la ligne
    newRow.appendChild(websiteCell);
    newRow.appendChild(pseudoCell);
    newRow.appendChild(passwordCell);
    newRow.appendChild(actionsCell);

    // Ajouter la ligne au corps du tableau
    tableBody.appendChild(newRow);
}

function deletePassword(website) {
    fetch(`http://localhost:3001/api/passwords`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ website: website })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du mot de passe');
        }
        return response.json();
    })
    .then(data => {
        alert('Mot de passe supprimé avec succès');
        location.reload(); // Recharger la page pour mettre à jour le tableau
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression du mot de passe');
    });
}
