var url = new URL("http://localhost:3001/api/listPassword");

var page = 1;
var number = 10;
var nbTotalPage;

var selectNumber = document.getElementById("select-number");

function getValueNumber() {
    // Récupération de la valeur du nombre de mots de passe par page dans le menu déroulant
    number = selectNumber.value;
    generateTabPassword(); // Régénération du tableau
}

// Décrémentation de l'indice de la page
function decrementPageIndex() {
    if (page > 1) {
        page--;
        updateTabInfos();
    }
}

// Incrémentation de l'indice de la page
function incrementPageIndex() {
    if (page < nbTotalPage) {
        page++;
        updateTabInfos();
    }
}

// Renseigne l'indice de la page consultée
function displayValuePageIndex() {
    $("#page").html(page);
}
displayValuePageIndex();

// Fonction pour accéder à la dernière page
function lastPage() {
    page = nbTotalPage;
    updateTabInfos();
}

// Fonction pour accéder à la première page
function firstPage() {
    page = 1;
    updateTabInfos();
}

function updateTabInfos() {
    generateTabPassword();
    displayValuePageIndex();
}

function generateTabPassword() {
    var clients = "";

    $.get("http://localhost:3001/api/listPassword", { "page": page, "number": number }, function (data) {
        nbTotalPage = data.totalPages;

        data.result.forEach(user => {
            // Boutons modifier et supprimer client depuis le tableau
            var deleteClient = "<button class='btn btn-danger' onclick='removeClient(" + user.id + ")'>Supprimer</button>";
            var editClient = "<a href='../modification/modificationClient.html?id=" + user.id + "'><button class='btn btn-warning'>Modifier</button></a>";

            // Génération de la ligne du tableau pour chaque utilisateur
            var client = `<tr>
            <td>`+ user.website + `</td>
            <td>` + user.email + `</td>
            <td>` + user.password + `</td>
            <td>` + user.created_at + `</td>
            <td>` + editClient + ' ' + deleteClient + `</td>
            </tr > `;

            clients = clients + client; // Concaténation des clients
        });
        $("#customersList").html(clients);
    });
}

generateTabClient();
