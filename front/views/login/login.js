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

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}


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

            //on crée un cookie pour la session
           setCookie("pseudoKP", UserKP.pseudoKP, 1);
           
            //on attend 1 seconde
            setTimeout(function(){
                //on redirige vers la page d'accueil
                window.location.href = "http://localhost:3000/accueil/accueil.html";
            }, 1000);    
        },

    //si erreur
        error: function (xhr) {
            $("#alert-message").attr('class', 'alert alert-danger');
            $("#alert-message").html(xhr.responseJSON.message);// Affichage du message d'erreur

        }
    });

}


function updateNavbar() {
    $(document).ready(function () {
        $("#header").load("../header.html", function() {
            // Une fois le contenu du header chargé, vérifier le cookie
            var pseudoKP = getCookie("pseudoKP");
            if (pseudoKP) {
                console.log("Pseudo trouvé dans le cookie : " + pseudoKP);
                $("#pseudoSession").text(pseudoKP);
                $("#connexionButton").hide();
                $("#deconnexionButton").show();
            }
    
            $("#logout").on("click", function() {
                document.cookie = "pseudoKP=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                location.reload();
            });
        });
    });
}

// Function to check the cookie and update navbar accordingly
function checkUserCookie() {
    var pseudoKP = getCookie('loginCookieSession');
    if (pseudoKP) {
        updateNavbar(pseudoKP);
    }
}

// Function to get a cookie value by name
function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

// Call checkUserCookie on page load
$(document).ready(function() {
    checkUserCookie();
});

