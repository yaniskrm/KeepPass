var url = new URL("http://localhost:3001/api/createuser");

$(document).on("submit", "#inscriptionForm", function (event) { //lorsque le formulaire est soumis

    event.preventDefault();

    //récuperer les valeurs du formulaire
    var first = document.getElementById("pseudoKP").value;
    var last = document.getElementById("passwordKP").value;

    console.log(first);
    console.log(last);

    //création du client
    var newUserKP = {
        "pseudoKP": first, "passwordKP": last
    };

    console.log(newUserKP);


createUser(newUserKP);
    
});

function createUser(client)
{

    //on envoie le client au serveur
    $.ajax({
        url: url,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(client),
        //en cas de succes
        success: function () {
        
            $("#alert-message").attr('class', 'alert alert-success');
            $("#alert-message").html("User ajouté");
    
        },

    //si erreur
        error: function (xhr) {
            $("#alert-message").attr('class', 'alert alert-danger');
            $("#alert-message").html(xhr.responseText);
        }
    });

}



