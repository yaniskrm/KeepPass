var url = new URL("http://localhost:3001/api/login");

$(document).on("submit", "#loginForm", function (event) { //lorsque le formulaire est soumis

    event.preventDefault();

    //récuperer les valeurs du formulaire
    var pseudoKP = document.getElementById("pseudoKP").value;
    var passwordKP = document.getElementById("passwordKP").value;

    //création du client
    var UserKP = {
        "pseudoKP": pseudoKP, "passwordKP": passwordKP
    };

createUser(UserKP);  
});

function createUser(UserKP){
    //on envoie le UserKP au serveur
    $.ajax({
        url: url,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(UserKP),
        //en cas de succes
        success: function () {
            $("#alert-message").attr('class', 'alert alert-success');
            $("#alert-message").html("Vous êtes connecté. Bienvenue sur KeepPass !");
            //on attend 1 seconde
            setTimeout(function(){
                //on redirige vers la page d'accueil
                //window.location.href = "http://localhost:3000/accueil/accueil.html";
            }, 1000);    
        },

    //si erreur
        error: function (xhr) {
            $("#alert-message").attr('class', 'alert alert-danger');
            $("#alert-message").html(xhr.responseJSON.message);// Affichage du message d'erreur

        }
    });

}



