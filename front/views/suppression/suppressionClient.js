var url = new URL("http://localhost:3001/api/removecustomer");


$(document).on("submit", "#removeCustomersForm", function (event) { //lorsque le formulaire est soumis

    event.preventDefault();

    //récuperer les valeurs du formulaire
    var idClient = document.getElementById("id").value;

    console.log(idClient);

    removeClient(idClient);

});



function removeClient(idClient) {


    if (confirm("Etes-vous sûr de vouloir supprimer ce client ?")) { //si oui
        //on envoie le client au serveur
        $.ajax({
            url: url + '?' + $.param({ "id": idClient }),
            method: "DELETE",
            contentType: "application/json",

            //en cas de succes        
            success: function () {

                $("#alert-message").attr('class', 'alert alert-success');
                $("#alert-message").html("Client Supprimé");

                console.log("done");

                setTimeout(function() {//si pas d'attente, trop de requête au même moment donc on patiente 1.5 secondes
                    //on a pas un serveur permettant de traiter plusieurs requêtes en même temps
                    generateTabClient(); //régénération du tableau après 1.5 secondes
                }, 1500);
            },

            //si erreur
            error: function (xhr) {

                $("#alert-message").attr('class', 'alert alert-danger');
                $("#alert-message").html(xhr.responseText);
            }
        });
    }


}
