var url = new URL("http://localhost:3001/api/createuser");

$(document).on("submit", "#inscriptionForm", function (event) { //lorsque le formulaire est soumis

    event.preventDefault();

    //récuperer les valeurs du formulaire
    var pseudoKP = document.getElementById("pseudoKP").value;
    var passwordKP = document.getElementById("passwordKP").value;

    console.log(pseudoKP);
    console.log(passwordKP);

    //création du client
    var newUserKP = {
        "pseudoKP": pseudoKP, "passwordKP": passwordKP
    };

    console.log(newUserKP);


createUser(newUserKP);
    
});

function createUser(newUserKP)
{

    //on envoie le newUserKP au serveur
    $.ajax({
        url: url,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(newUserKP),
        //en cas de succes
        success: function () {
        
            $("#alert-message").attr('class', 'alert alert-success');
            $("#alert-message").html("Nouvel utilisateur KeepPass ajouté !");
    
        },

    //si erreur
        error: function (xhr) {
            $("#alert-message").attr('class', 'alert alert-danger');
            $("#alert-message").html(xhr.responseJSON.message);// Affichage du message d'erreur

        }
    });

}



