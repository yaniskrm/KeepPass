document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault(); // Empêche la soumission classique du formulaire

        // Récupération des valeurs saisies par l'utilisateur
        const pseudo = document.getElementById('exampleInputpseudo1').value;
        const password = document.getElementById('exampleInputPassword1').value;

        // Envoi des données au serveur
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                pseudo: pseudo,
                password: password,
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('La réponse du réseau n\'était pas ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Échec de la connexion : vérifiez votre pseudo ou votre mot de passe');
        });
    });
});
