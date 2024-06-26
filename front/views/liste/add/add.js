// Function to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

$(document).ready(function () {
    $("#addPasswordForm").on("submit", function (event) {
        event.preventDefault();

        // Récupérer les valeurs du formulaire
        var website = $("#website").val();
        var pseudo = $("#pseudo").val();
        var password = $("#password").val();
        var pseudoKP = getCookie("pseudoKP");
        
        console.log(website);
        console.log(pseudo);
        console.log(password);

        // Création de l'objet mot de passe
        var passwordData = {
            pseudoKP: pseudoKP,
            website: website,
            pseudo: pseudo,
            password: password
        };

        // Envoi des données au serveur
        $.ajax({
            url: "http://localhost:3001/api/addPassword",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(passwordData),
            success: function () {
                $("#alert-message").attr('class', 'alert alert-success');
                $("#alert-message").html("Mot de passe ajouté avec succès !");
                window.location.href = '../list.html';
            },
            error: function (xhr) {
                $("#alert-message").attr('class', 'alert alert-danger');
                $("#alert-message").html("Erreur dans l'ajout d'un mot de passe");
                console.error("Erreur lors de l'ajout du mot de passe:", xhr.responseText);
            }
        });
    });
});
