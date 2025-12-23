"use strict";
import { getCities, getRandomCity } from "../../services/city-api.js";

const input = document.querySelector("#cityInput");
const suggestions = document.querySelector("#suggestions");
const searchButton = document.querySelector(".btn.primary");
const randomButton = document.querySelector(".btn.random");

//debounce timer
let typeStallTimer = null;
//last searched city objects
let lastFetchedCities = [];

/**
 * Render the autocomplete suggestions list
 * @param cities - Array of city objects from API
 * @param citySelect - Callback when a city is selected
 */
function renderSuggestions(cities, citySelect) {
	suggestions.textContent = "";

	if (!cities || cities.length === 0) {
		suggestions.style.display = "none";
		return;
	}

	cities.forEach((city) => {
		const cityList = document.createElement("li");
		const name = city.city;

		cityList.textContent =
			name + (city.region ? `, ${city.region}` : "") + `, ${city.country}`;

		cityList.addEventListener("click", () => citySelect(city));
		suggestions.appendChild(cityList);
	});

	suggestions.style.display = "block";
}

/**
 * A method that handles the selection of a city by saving its object to local storage and navigating to the next page
 * @param {*} cityObject The selected city object
 */
function handleCitySelect(cityObject) {
	if (!cityObject) return;

	//set name of city in search bar
	input.value = cityObject.city;

	//save to local storage and navigate to next page
	localStorage.setItem("selectedCity", JSON.stringify(cityObject));
	window.location.href = "./city-overview/result.html";
}

/**
 * A method that passes a valid city object to the handleCitySelect method
 */
function selectTypedCity() {
	const cityName = input.value.trim();

	const cityObject = lastFetchedCities.find(
		(city) => city.city.toLowerCase() === cityName.toLowerCase()
	);

	if (!cityObject) {
		alert("Please type and select a city.");
		return;
	}

	handleCitySelect(cityObject);
}

//! EVENT LISTENERS
searchButton.addEventListener("click", selectTypedCity);

randomButton.addEventListener("click", async () => {
	const randomCity = await getRandomCity();
	handleCitySelect(randomCity);
});

//Note: since i'm on the free plan of the GeoDB cities API, i had to find a way to
// limit API calls. The solution i found online was debouncing (only call after a certain
// amount of time has passed since the last key stroke)
input.addEventListener("input", () => {
	const userInput = input.value.trim();
	clearTimeout(typeStallTimer);

	if (userInput.length < 2) {
		suggestions.style.display = "none";
		return;
	}

	typeStallTimer = setTimeout(async () => {
		lastFetchedCities = await getCities(userInput);
		renderSuggestions(lastFetchedCities, handleCitySelect);
	}, 300);
});

// Hide suggestions when clicking outside of suggestions list
document.addEventListener("click", () => {
	suggestions.style.display = "none";
});

document.querySelector(".autocomplete").addEventListener("click", (event) => {
	event.stopPropagation();
});
