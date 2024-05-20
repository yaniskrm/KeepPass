var url = new URL("http://localhost:3001/api/addcustomers");

$(document).on("submit", "#addCustomersForm", function (event) { //lorsque le formulaire est soumis

    event.preventDefault();

    //récuperer les valeurs du formulaire
    var website = document.getElementById("website").value;
    var pseudo = document.getElementById("pseudo").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    

    //création du client
    var client = {
        "id": null, "pseudo": pseudo, "email": email,
        "password": password, "created_at": null
    };

createClient(client);
    
});

function createClient(client)
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
            $("#alert-message").html("Client ajouté");
    
        },

    //si erreur
        error: function (xhr) {
            $("#alert-message").attr('class', 'alert alert-danger');
            $("#alert-message").html(xhr.responseText);
        }
    });

}