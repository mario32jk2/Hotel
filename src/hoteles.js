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
    imgBandera.setAttribute("src", `./assets/${hotels.country}-flags.png`);
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




// filtro fechas
const fechaEntrada = document.getElementById("checkIn");
const fechaSalida = document.getElementById("checkOut");


// Obtener fecha actual
const today = new Date();

// Función para agregar un cero inicial si el número es menor a 10
function addLeadingZero(number) {
  return number < 10 ? "0" + number : number;
}

// Calcular fechas de check-in y check-out predeterminadas
const day = today.getDate();
const month = today.getMonth() + 1;
const year = today.getFullYear();
const hotelesEntrada = `${year}-${addLeadingZero(month)}-${addLeadingZero(day)}`;
const hotelesSalida = `${year}-${addLeadingZero(month)}-${addLeadingZero(day + 1)}`;

// Establecer atributos mínimos para los campos de fecha
fechaEntrada.setAttribute("min", hotelesEntrada);
fechaSalida.setAttribute("min", hotelesSalida);

// Función para verificar si un hotel está disponible
function HotelReady(hotels, diffSecons) {
  const AvailFrom = new Date(hotels.availabilityFrom).getTime();
  const AvailTo = new Date(hotels.availabilityTo).getTime();
  const AvailDiff = AvailTo - AvailFrom;
  return AvailDiff >= diffSecons;
}

// Función para calcular la diferencia en días y filtrar los hoteles disponibles
let fechaSalidaSelected = false
function calculateDifferenceDays() {
  const OptCheckIn = new Date(fechaEntrada.value).getTime();
  const OptCheckOut = new Date(fechaSalida.value).getTime();

  if (!fechaSalidaSelected) {
    return;
  }

  const DayMillis = 24 * 60 * 60 * 1000; 
  const diffSecons = Math.round((OptCheckOut - OptCheckIn) / DayMillis) * DayMillis;

  const hotelesDisponibles = json.filter((hotel) => {
    return HotelReady(hotel, diffSecons);
  });

  section.innerHTML = "";

  if (hotelesDisponibles.length > 0) {
    getHotels(hotelesDisponibles);
  } else {
    section.innerHTML = "¡Lo siento! No hay hoteles disponibles para este rango de fechas.";
    
  }
}

// Establecer listeners de cambio para los campos de fecha
fechaEntrada.addEventListener("change", calculateDifferenceDays);
fechaSalida.addEventListener("change", function () {
  fechaSalidaSelected = true;
  calculateDifferenceDays();
});