//fonction pour la destruction d'un cookie
function deleteCookie(cname) {
    if (getCookie(cname)) { //si le cookie existe
            //changement de la date d'expiration du cookie
        document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
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
            else {
                $("#pseudoSession").text("");
                $("#connexionButton").show();
                $("#deconnexionButton").hide();
            }
    
            deleteCookie("pseudoKP");
            location.reload();

        });
    });
}

document.getElementById("deconnexionButton").addEventListener("click", function() {
    updateNavbar();
});
