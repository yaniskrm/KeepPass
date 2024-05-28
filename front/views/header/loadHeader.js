// loadHeader.js

function getCookie(name) {
    let value = `; ${document.cookie}`;
    let parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

$(document).ready(function () {
    fetch('front\views\header\header.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            // Call function to handle session cookie
            handleSessionCookie();
        })
        .catch(error => console.error('Error loading header:', error));
});

function handleSessionCookie() {
    var pseudoKP = getCookie("pseudoKP");
    if (pseudoKP) {
        $("#pseudoSession").text("Bienvenue " + pseudoKP);
        $("#pseudoSession").show(); // Affiche le pseudo
        $("#connexionButton").hide();
        $("#deconnexionButton").show(); // Afficher le bouton de déconnexion
    }

    $("#deconnexionButton").on("click", function() {
        document.cookie = "pseudoKP=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        location.reload();
    });
}
