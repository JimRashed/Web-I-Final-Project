"use strict";

//fetch stored city item
const city = JSON.parse(localStorage.getItem("selectedCity"));
const cityNameP = document.querySelector("#cityName");
const descriptionP = document.querySelector("#cityDescription");
const populationP = document.querySelector("#population");
const coordinatesP = document.querySelector("#coordinates");
const weatherP = document.querySelector("#weather");
const flagImage = document.querySelector(".country img");

const loadObjectData = () => {
	cityNameP.textContent = city.name;
	descriptionP.textContent = `A city in the country of ${city.country}`;
	populationP.textContent = city.population;
	coordinatesP.textContent = `${city.latitude}°, ${city.longitude}°`;
	flagImage.src = `https://flagcdn.com/w80/${city.countryCode.toLowerCase()}.png`;
};

loadObjectData();
