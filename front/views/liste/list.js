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
        // Traitement de la réponse
        data.forEach(passwordInfo => {
            //Accès aux données pour chaque mot de passe
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
        // Ajouter ici la logique pour modifier le mot de passe
        console.log("Modifier le mot de passe pour :", website);

        // Amène vers le formulaire de modification
        window.location.href = `http://localhost:3000/liste/edit/editInfosForm.html`;
    });

    // Créer le bouton "Supprimer"
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Supprimer";
    deleteButton.classList.add("btn", "btn-danger", "btn-sm");
    deleteButton.addEventListener("click", function() {
        // Ajouter ici la logique pour supprimer le mot de passe
        console.log("Supprimer le mot de passe pour :", website);
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



// function populateTable(passwords) {
//     const tableBody = document.getElementById('passwordTableBody');
//     tableBody.innerHTML = ''; // Clear existing table rows
//     console.log(passwords);
//     passwords.forEach(password => {
//         const row = document.createElement('tr');

//         const websiteCell = document.createElement('td');
//         websiteCell.textContent = password.website;
//         row.appendChild(websiteCell);

//         const pseudoCell = document.createElement('td');
//         pseudoCell.textContent = password.pseudo;
//         row.appendChild(pseudoCell);

//         const passwordCell = document.createElement('td');
//         passwordCell.textContent = password.password;
//         row.appendChild(passwordCell);

//         const actionsCell = document.createElement('td');
//         actionsCell.innerHTML = `
//                 <button class="btn btn-primary btn-sm" onclick="editPassword(${password.idAccount})">
//                     <i class="fa fa-pencil"></i> 
//                 </button>
//                 <button class="btn btn-danger btn-sm" onclick="deletePassword(${password.idAccount})">
//                     <i class="fa fa-trash"></i> 
//                 </button>
//             `;

//         row.appendChild(actionsCell);

//         tableBody.appendChild(row);
//     });
// }

function deletePassword(id) {
    fetch(`http://localhost:3001/api/passwords/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du mot de passe');
        }
        return response.json();
    })
    .then(data => {
        alert('Mot de passe supprimé avec succès');
        location.reload(); // Reload the page to update the table
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression du mot de passe');
    });
}

function editPassword(id) {
    const website = prompt('Entrez le nouveau site web:');
    const pseudo = prompt('Entrez le nouveau pseudo:');
    const password = prompt('Entrez le nouveau mot de passe:');

    if (website && pseudo && password) {
        fetch(`http://localhost:3001/api/passwords/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ website, pseudo, password })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la modification du mot de passe');
            }
            return response.json();
        })
        .then(data => {
            alert('Mot de passe modifié avec succès');
            location.reload(); // Reload the page to update the table
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur lors de la modification du mot de passe');
        });
    } else {
        alert('Tous les champs doivent être remplis');
    }
}