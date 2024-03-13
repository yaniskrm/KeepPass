var url = new URL("http://localhost:3001/api/addcustomers");

$(document).on("submit", "#addCustomersForm", function (event) { //lorsque le formulaire est soumis

    event.preventDefault();

    //récuperer les valeurs du formulaire
    var first = document.getElementById("first").value;
    var last = document.getElementById("last").value;
    var email = document.getElementById("email").value;
    var company = document.getElementById("company").value;
    var country = document.getElementById("country").value;

    //création du client
    var client = {
        "id": null, "email": email, "first": first, "last": last,
        "company": company, "created_at": null, "country": country
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



