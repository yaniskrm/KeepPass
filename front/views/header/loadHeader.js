// Function to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

// Function to handle session cookies and update the header
function handleSessionCookie() {
    const pseudoKP = getCookie("pseudoKP");
    if (pseudoKP) {
        document.getElementById("pseudoSession").textContent = pseudoKP;
        document.getElementById("pseudoSession").style.display = "block"; // Show the pseudo
        document.getElementById("connexionButton").style.display = "none";
        document.getElementById("deconnexionButton").style.display = "block"; // Show the logout button
    }

    document.getElementById("deconnexionButton").addEventListener("click", function() {
        document.cookie = "pseudoKP=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        location.reload();
    });
}

// Function to load header HTML
function loadHeader() {
    fetch("../header/header.html")
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
            handleSessionCookie();
        })
        .catch(error => {
            console.error('Error loading header:', error);
        });
}

document.addEventListener("DOMContentLoaded", function() {
    loadHeader();
});
