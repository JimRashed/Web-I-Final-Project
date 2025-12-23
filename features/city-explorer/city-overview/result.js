"use strict";
import { getWeather } from "../../../services/weather-api.js";
import { getImageSrc } from "../../../services/city-image-api.js";
//fetch stored city item
const city = JSON.parse(localStorage.getItem("selectedCity"));
const cityNameP = document.querySelector("#cityName");
const descriptionP = document.querySelector("#cityDescription");
const populationP = document.querySelector("#population");
const coordinatesP = document.querySelector("#coordinates");
const weatherP = document.querySelector("#weather");
const flagImage = document.querySelector(".country img");
const timeP = document.querySelector("#currentTime");
const cityImage = document.querySelector("#cityImage");
const skeleton = document.querySelector(".image-skeleton");

/**
 * A function to fetch and display data about the page's city. It does so via existing data in the city object as well as
 * by calling the GetWeather and getImageSrc methods and formatting their response.
 */
const loadObjectData = async () => {
	cityNameP.textContent = city.name;
	descriptionP.textContent = `A city in the country of ${city.country}`;
	populationP.textContent = city.population;
	coordinatesP.textContent = `${city.latitude}°, ${city.longitude}°`;
	flagImage.src = `https://flagcdn.com/w80/${city.countryCode.toLowerCase()}.png`;

	try {
		const weatherResponse = await getWeather(city.latitude, city.longitude);
		//set weather
		weatherP.textContent =
			weatherResponse.current_weather.temperature +
			weatherResponse.current_weather_units.temperature;

		//format time and set it
		const isoTime = weatherResponse.current_weather.time;
		const formattedTime = isoTime.split("T")[1];
		timeP.textContent = formattedTime;

		//set image
		const imageData = await getImageSrc(city.name);
		if (imageData) {
			cityImage.src = imageData.large2x;
		}
	} catch (error) {
		console.error("Could not load city weather:" + error);
	}
};

loadObjectData();

//! EVENT LISTENERS
cityImage.addEventListener("load", () => {
	cityImage.classList.add("loaded");
	skeleton.classList.add("hidden");
});
