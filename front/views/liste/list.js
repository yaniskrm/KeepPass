var url = new URL("http://localhost:3001/api/customers");

var page = 1;
var number = 10;
var nbTotalPage;

var selectNumber = document.getElementById("select-number");

function getValueNumber() {

    //recupération de la valeur du nombre de client par page dans le menu déroulant
    number = selectNumber.value;

    generateTabClient(); //régénération du tableau
}
//décrementation de l'indice de la page
function decrementPageIndex() {
    if (page > 1) {
        page--;
        updateTabInfos();
    }
}
//incrementation de l'indice de la page
function incrementPageIndex() {
    var nbTotalPage = 1000;
    if (page < nbTotalPage) {
        page++;
        updateTabInfos();
    }

}

//renseigne l'indice de la page consultée
function displayValuePageIndex() {
    $("#page").html(page);
}
displayValuePageIndex();


//fonction pour accéder à la dernière page
function lastPage() {
    page = nbTotalPage;
    updateTabInfos();
}


//fonction pour accéder à la première page
function firstPage() {
    page = 1;
    updateTabInfos();
}

function updateTabInfos() {
    generateTabClient();
    displayValuePageIndex();
}


function generateTabClient() {

    var clients = "";

    $.get("http://localhost:3001/api/customers", { "page": page, "number": number }, function (data) {
        nbTotalPage = data.totalPages;

        data.result.forEach(user => {

            //boutons modifier et supprimer client depuis le tableau
            var deleteClient = "<button class='btn btn-danger' onclick='removeClient(" + user.id + ")'>Supprimer</button>";
            var editClient = "<a href='../modification/modificationClient.html?id=" + user.id + "'><button class='btn btn-warning'>Modifier</button></a>";


            var client = `<tr>
            <td>`+ user.id + `</td>
            <td>`+ user.first + " " + user.last + `</td>
            <td>` + user.company + `</td>
            <td>` + user.country + `</td>
            <td>` + user.email + `</td>
            <td>` + user.created_at + `</td>
            <td>` + editClient + ' ' + deleteClient + `</td>
            </tr > `;

            clients = clients + client; //concaténation des clients

        });
        $("#customersList").html(clients);
    });
}

generateTabClient();
