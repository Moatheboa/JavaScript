$(document).ready(function() {
    loadUserRecipes(); //Viktigt att denna funktion anropas före generateMenu() för att ankarlänkar för nya recept ska tillkomma.
    generateMenu();
});


function loadUserRecipes() {
    var headString = localStorage.getItem('headlines');
    var recString = localStorage.getItem('recipes');

    if (recString && headString) {
        var rubrik = JSON.parse(headString); //Omvandlar till js-objekt för att kunna iterera genom recepten.
        var recept = JSON.parse(recString);

        var existingRecipes = document.querySelectorAll('.newRecipe'); // Här tas tidigare laddade recept bort från sidan så att det inte blir dubletter:
        existingRecipes.forEach(function(recipe) {
            recipe.remove();
        });

        for (var i = 0; i < rubrik.length; i++) {
            addRecipe(rubrik[i], recept[i]); //Rubriker och recept från localStorage laddas upp i Dom-trädet via addRecipe().
        }
    }
}

function generateMenu() {
    var listMenu = document.createElement("ul");
    var menuGrandparent = document.getElementById("receptmeny");
    var menuParent = menuGrandparent.querySelector(".contentarea");
    menuParent.appendChild(listMenu);
    
    var receptList = document.getElementsByTagName("h4"); //En collection med alla receptrubriker PLUS rubriken för menyn, som är sist i listan.
    for (var i = 0; i < receptList.length - 1; i++) {  // -1 för att inte ta med den sista <h4>, rubrikmenyn.
        var currentHeadline = receptList[i];
        currentHeadline.setAttribute("id", i); //Ger receptrubriken ett id för att kunne länka till den.
        var anchor = document.createElement("a");
        anchor.href = "#" + i;
        anchor.textContent = receptList[i].textContent; //Sätter rubrikmenyn som text i ankarlänken.
        var listEl = document.createElement("li");
        listEl.appendChild(anchor);
        listMenu.appendChild(listEl);
    }
}


// För att lägga till recept och dess rubrik i DOM-trädet, enhetligt med befintliga recept på sidan:
function addRecipe(rubrik, recept) {
    
    var postDiv = document.createElement("div");
    postDiv.classList.add("post", "newRecipes");

    var newHeadline = document.createElement("h4");
    newHeadline.textContent = rubrik;

    var contentDiv = document.createElement("div");
    contentDiv.className = "contentarea";

    var newRecipe = document.createElement("p");
    newRecipe.textContent = recept;

    postDiv.appendChild(newHeadline);
    postDiv.appendChild(contentDiv);
    contentDiv.appendChild(newRecipe);

    // För att placera den nya div-en sist i receptlistan ska det placeras före addForm som är sista barnet:
    var siblingElement = document.getElementById("addForm");
    var parentElement = siblingElement.parentNode;
    parentElement.insertBefore(postDiv, siblingElement);
}

function headlineToLocalStorage(key, headline) {
    var storedArray = JSON.parse(localStorage.getItem(key)) || []; //Hämtar existerande array eller skapar ny om det är första gången.
    storedArray.push(headline);
    localStorage.setItem(key, JSON.stringify(storedArray));
}

function recipeToLocalStorage(key, recipe) {
    var storedArray = JSON.parse(localStorage.getItem(key)) || []; 
    storedArray.push(recipe);
    localStorage.setItem(key, JSON.stringify(storedArray));
}

function submitRecipe(evt) {
    evt.preventDefault();
    
    var rubrik = document.getElementById("rubrikInput").value;
    var recept = document.getElementById("userRecept").value;
    
    if (rubrik && recept) {
        headlineToLocalStorage("headlines", rubrik);
        recipeToLocalStorage("recipes", recept);
    }

    addRecipe(rubrik, recept);  //Lägger till receptet på sidan direkt.  Ankarlänken till recpetet läggs till först när sidan laddas om.
    
    document.getElementById("rubrikInput").value = ""; // Rensar formulärfälten för tydlighet och så att nya recept kan läggas till.
    document.getElementById("userRecept").value = "";
}


// Skapar ett form där användaren kan skriva in sina egna recept:
var form = document.createElement('form');
form.id = "addForm";

var heading = document.createElement('h3');
heading.textContent = "Vill du lägga till ditt egna recept?";
var rubrikInput = document.createElement('input');
rubrikInput.type = "text";
rubrikInput.id = "rubrikInput";
rubrikInput.placeholder = "Rubrik:";

var userRecept = document.createElement('textarea');
userRecept.id = "userRecept";
userRecept.placeholder = "Skriv in ditt recept här:";
userRecept.rows = 10;
userRecept.cols = 90;


var formButton = document.createElement('button');
formButton.type = "submit";
formButton.textContent = "Skicka";

form.appendChild(document.createElement('br'));
form.appendChild(heading);
form.appendChild(rubrikInput);
form.appendChild(document.createElement('br')); 
form.appendChild(userRecept);
form.appendChild(document.createElement('br')); 
form.appendChild(formButton);

var formParent = document.getElementById("primarycontent")
formParent.appendChild(form); // Lägger till formuläret under alla recept.

form.addEventListener("submit", submitRecipe, false);