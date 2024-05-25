document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3001/api/passwords', {
        method: 'GET',
        credentials: 'include' // Include credentials to send cookies
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        populateTable(data);
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des mots de passe:', error);
    });
});

function populateTable(passwords) {
    const tableBody = document.getElementById('passwordTableBody');
    tableBody.innerHTML = ''; // Clear existing table rows
    console.log(passwords);
    passwords.forEach(password => {
        const row = document.createElement('tr');

        const websiteCell = document.createElement('td');
        websiteCell.textContent = password.website;
        row.appendChild(websiteCell);

        const pseudoCell = document.createElement('td');
        pseudoCell.textContent = password.pseudo;
        row.appendChild(pseudoCell);

        const passwordCell = document.createElement('td');
        passwordCell.textContent = password.password;
        row.appendChild(passwordCell);

        const actionsCell = document.createElement('td');
        actionsCell.innerHTML = `
                <button class="btn btn-primary btn-sm" onclick="editPassword(${password.idAccount})">
                    <i class="fa fa-pencil"></i> 
                </button>
                <button class="btn btn-danger btn-sm" onclick="deletePassword(${password.idAccount})">
                    <i class="fa fa-trash"></i> 
                </button>
            `;

        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });
}

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