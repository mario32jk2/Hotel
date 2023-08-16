import { apiHotels } from "./api.js";
const section = document.getElementById("container-targets-hotels");
const response = await apiHotels();
const json = await response.json();
console.log(json);
let filteredData = json
function generatecharacterprice(numero) {
  return "$".repeat(numero);
}
// CHANGE SYMBOL TO TEXT
function symbolToNumber(text) {
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

let shouldShowMessage = false;
function applyFilters() {
  let tempData = json;

  
  // Apply price filter
  const selectedPrice = filterPrices.value;
  let priceSelect = filterPrices.options[filterPrices.selectedIndex];
  const textPreiceSelected = priceSelect.textContent;
  const changeToNumber = symbolToNumber(textPreiceSelected);
  if (selectedPrice != "all") {
    tempData = tempData.filter((hotel) => hotel.price == changeToNumber);
  }
  // Apply date filter
  if (dateCheckOutSelected) {
    const differenceInMilliseconds = calculateDifferenceDays();
    tempData = tempData.filter((hotel) =>
      isHotelAvailable(hotel, differenceInMilliseconds)
    );
  }
  filteredData = tempData;
  shouldShowMessage = filteredData.length > 0;

  const messageContainer = document.getElementById("message-container");
  if (filteredData.length == 0) {
    messageContainer.textContent = "Sorry we don't have hotels available";
  }
}


getHotels(json);

// FILTER COUNTRIES

// FILTER PRICES
const filterPrices = document.getElementById("prices");
filterPrices.addEventListener("change", () => {
  applyFilters();
  section.innerHTML = "";
  getHotels(filteredData);
  
});

// FILTER DATE
const dateCheckIn = document.getElementById("checkIn");
const dateCheckOut = document.getElementById("checkOut");
const today = new Date();

function zerodate(dateZero) {
  const converText = "" + dateZero;
  if (converText.length === 1) {
    return "0" + dateZero;
  } else {
    return dateZero;
  }
}

const day = today.getDate();
const month = today.getMonth() + 1;
const year = today.getFullYear();
const dateCheckInHotels = year + "-" + zerodate(month) + "-" + zerodate(day);
const dateCheckOutHotels =
  year + "-" + zerodate(month) + "-" + zerodate(day + 1);
dateCheckIn.setAttribute("min", dateCheckInHotels);
dateCheckOut.setAttribute("min", dateCheckOutHotels);

dateCheckIn.addEventListener("change", () => {
  const parts = dateCheckIn.value.split("-");
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);
  const finalDate = year + "-" + zerodate(month) + "-" + zerodate(day + 1);
  dateCheckOut.setAttribute("min", finalDate);
  dateCheckOutSelected = false;
  applyFilters();
  section.innerHTML = "";
  getHotels(filteredData);
});

function isHotelAvailable(hotel, differenceInMilliseconds) {
  const availabilityFrom = hotel.availabilityFrom;
  const availabilityTo = hotel.availabilityTo;
  const availabilityDifference = availabilityTo - availabilityFrom;
  return availabilityDifference >= differenceInMilliseconds;
}

let dateCheckOutSelected = false;
function calculateDifferenceDays() {
  const currentDateIni = new Date();
  currentDateIni.setHours(0, 0, 0, 0);
  const optionCheckInIni = new Date(dateCheckIn.value + " 00:00:00");
  optionCheckInIni.setHours(0, 0, 0, 0);
  const optionCheckIn = optionCheckInIni.getTime();

  if (dateCheckOut.value == "") {
    return;
  }
  const optionCheckOut = new Date(dateCheckOut.value);
  const millisecondsDate = optionCheckOut - optionCheckIn;
  const millisecondsInADay = 24 * 60 * 60 * 1000; // 86,400,000
  return Math.round(millisecondsDate / millisecondsInADay) * millisecondsInADay;
}
dateCheckIn.value = "";
dateCheckOut.value = "";

dateCheckOut.addEventListener("change", () => {
  dateCheckOutSelected = true;
  applyFilters();
  section.innerHTML = "";
  getHotels(filteredData);

});

//funcion para eliminar filtros
const buttonFilter = document.getElementById("clear");
buttonFilter.addEventListener("click", () => {
  section.innerHTML = "";
  getHotels(json);
});