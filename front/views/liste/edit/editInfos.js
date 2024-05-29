document.addEventListener("DOMContentLoaded", function () {
    // Récupérer les informations depuis le localStorage
    const website = localStorage.getItem('editWebsite');
    const pseudo = localStorage.getItem('editPseudo');
    const password = localStorage.getItem('editPassword');

    // Pré-remplir le formulaire avec les informations récupérées
    if (website) {
        document.getElementById('website').value = website;
    }
    if (pseudo) {
        document.getElementById('pseudo').value = pseudo;
    }
    if (password) {
        document.getElementById('password').value = password;
    }

    // Gérer la soumission du formulaire
    document.getElementById('editForm').addEventListener('submit', function (e) {
        e.preventDefault(); // Empêcher la soumission du formulaire

        const newPseudo = document.getElementById('pseudo').value;
        const newPassword = document.getElementById('password').value;
        console.log(newPassword);

        // Vérifier que tous les champs sont remplis
        if (!website || !newPseudo || !newPassword) {
            alert('Tous les champs doivent être remplis');
            return;
        }

        // Envoyer la requête PUT au serveur pour mettre à jour les informations
        fetch(`http://localhost:3001/api/passwords`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                // Récupérer le pseudo depuis le cookie
                pseudoKP: getCookie('pseudoKP'),
                website: website,
                pseudo: newPseudo,
                password: newPassword
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la modification du mot de passe');
            }
            return response.json();
        })
        .then(data => {
            alert('Mot de passe modifié avec succès');
            // Rediriger vers la liste après modification
            window.location.href = '../list.html';
        })
        .catch(error => {
            console.error('Erreur:', error);
            alert('Erreur lors de la modification du mot de passe');
        });
    });
});
