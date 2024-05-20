var url = new URL("http://localhost:3001/api/listPassword");

var selectNumber = document.getElementById("select-number");

function getValueNumber() {
    // Récupération de la valeur du nombre de mots de passe par page dans le menu déroulant
    number = selectNumber.value;
    generateTabPassword(); // Régénération du tableau
}

function generateTabPassword() {
    var clients = "";

    $.get("http://localhost:3001/api/listPassword", function (data) {

        data.result.forEach(user => {
            // Boutons modifier et supprimer client depuis le tableau
            var deleteClient = "<button class='btn btn-danger' onclick='removeClient(" + user.id + ")'>Supprimer</button>";
            var editClient = "<a href='../modification/modificationClient.html?id=" + user.id + "'><button class='btn btn-warning'>Modifier</button></a>";

            // Génération de la ligne du tableau pour chaque utilisateur
            var client = `<tr>
            <td>`+ user.website + `</td>
            <td>` + user.pseudo + `</td>
            <td>` + user.email + `</td>
            <td>` + user.password + `</td>
            <td>` + editClient + ' ' + deleteClient + `</td>
            </tr > `;

            clients = clients + client; // Concaténation des clients
        });
        $("#customersList").html(clients);
    });
}

generateTabPassword();
