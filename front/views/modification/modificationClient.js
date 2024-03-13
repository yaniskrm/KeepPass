var url = new URL("http://localhost:3001/api/editcustomer");

//fonction pour récupérer les infos en paramètre dans l'url
function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
};


//si id est bien défini dans l'url, on le récupère
const id = GetURLParameter('id');
    console.log("id", id);
    if(id) {
        document.getElementById("idClient").value = id;
        document.getElementById("idClient").readOnly = true;
        var idClient = id;
    }
    else {//sinon on récupère l'id du champ du formulaire
        var idClient = document.getElementById("idClient").value;
    }

//EVOLUTION POSSIBLE: faire une fonction qui récupère les infos du client en fonction de l'id
//et qui les affiche dans les champs du formulaire
//=>permet d'avoir les champs préremplis et de savoir de quel client il s'agit


$(document).on("submit", "#editCustomerForm", function (event) { //lorsque le formulaire est soumis
    console.log("debut");

    event.preventDefault();

    //récuperer les valeurs du formulaire edit
    var editFirst = document.getElementById("editFirst").value;
    var editLast = document.getElementById("editLast").value;
    var editEmail = document.getElementById("editEmail").value;
    var editCompany = document.getElementById("editCompany").value;
    var editCountry = document.getElementById("editCountry").value;

    //création du client
    var client = {
        "id": idClient, "email": editEmail, "first": editFirst, "last": editLast,
        "company": editCompany, "created_at": null, "country": editCountry
    };

    editClient(client);
});

function editClient(client) {

    //on envoie le client au serveur
    $.ajax({
        url: url,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(client),
        //en cas de succes
        success: function () {

            $("#alert-message").attr('class', 'alert alert-success');
            $("#alert-message").html("Client Modifié !");

            console.log("done");
        },

        //si erreur
        error: function (xhr) {
            $("#alert-message").attr('class', 'alert alert-danger');
            $("#alert-message").html(xhr.responseText);
        }
    });

}






