import { apiHotels } from "./api.js";
const section = document.getElementById("container-targets-hotels");
const response = await apiHotels();
const json = await response.json();
console.log(json);

function generatecharacterprice(numero) {
  return "$".repeat(numero);
}
// CHANGE SYMBOL TO TEXT
function symbolTxt(text) {
  return text.split("$").length - 1;
}

async function getHotels(json) {
  json.forEach((hotels) => {
    //select trgets hotels
    const article = document.createElement("article");
    article.className = "target-hotels-class";
    article.id = "target-hotels-id";
    section.appendChild(article);

    //Crear e introducir imagnes
    const imgHotels = document.createElement("img");
    imgHotels.setAttribute("src", hotels.photo);
    imgHotels.setAttribute("alt", "foto hotel");
    imgHotels.className = "images-hotels";
    article.appendChild(imgHotels);

    //Crear e introducir nombre de hoteles
    const nombreHotel = document.createElement("h2");
    nombreHotel.className = "names-hotels";
    nombreHotel.innerText = hotels.name;
    article.appendChild(nombreHotel);
    //crear e insertar div que tenga section y el button
    const divArticle = document.createElement("div");
    divArticle.className = "div-article";
    article.appendChild(divArticle);

    //crear e introducir section
    const sectionHijo = document.createElement("section");
    sectionHijo.className = "container-info";
    divArticle.appendChild(sectionHijo);

    // crear e introducir div va a contneer el pais y el price
    const divContainer = document.createElement("div");
    divContainer.className = "container-div";
    sectionHijo.appendChild(divContainer);

    //crear e introducir div que va a contener la img bandera y el pais texto
    const divBandera = document.createElement("div");
    divBandera.className = "container-div-bandera";
    const nameCountry = document.createElement("p");
    nameCountry.innerText = hotels.country;
    const imgBandera = document.createElement("img");
    imgBandera.setAttribute("src", `./assets/${hotels.country}-flag.png`);
    divBandera.appendChild(imgBandera);
    divBandera.appendChild(nameCountry);
    divContainer.appendChild(divBandera);

    //crear e introducir div qe va a contener el precio y las habitaciones
    const divPrice = document.createElement("div");
    divPrice.className = "container-div-price";
    const rooms = document.createElement("p");
    rooms.innerText = `${hotels.rooms} rooms -`;
    const paragraphPrices = document.createElement("p");
    paragraphPrices.innerText = generatecharacterprice(hotels.price);

    divPrice.appendChild(rooms);
    divPrice.appendChild(paragraphPrices);
    divContainer.appendChild(divPrice);

    //crear e insertar boton book it!
    const buttonBookIt = document.createElement("button");
    buttonBookIt.className = "button-book-it";
    buttonBookIt.innerText = "Book it!";

    divArticle.appendChild(buttonBookIt);
  });
}

getHotels(json);

//function filterPrices
const filterSelect = document.getElementById("prices");

filterSelect.addEventListener("change", () => {
  let optionsPrices = filterSelect.value;
  let selectprices = filterSelect.options[filterSelect.selectedIndex];
  let txtContentent = selectprices.textContent;
  let changeTxt = symbolTxt(txtContentent);
  let consultDate = json;

  if (optionsPrices != "all") {
    consultDate = json.filter((hotels) => hotels.price == changeTxt);
  }

  section.innerHTML = "";
  getHotels(consultDate);
});


//funcion para eliminar filtros
const buttonFilter = document.getElementById("clear");
buttonFilter.addEventListener("click", () => {
  section.innerHTML = "";
  getHotels(json);
});


