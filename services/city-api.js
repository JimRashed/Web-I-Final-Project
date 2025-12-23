"use strict";

//TODO - ADD API KEY
const API_KEY = "3f26d0206bmsha408cf33eeccf99p1edf76jsn783a8903578b";
const API_HOST = "wft-geo-db.p.rapidapi.com";

/**
 * The asynchronous function to fetch a list of cities from the GeoDB API
 * @param {*} searchValue The inputted value of the city name the user is searching for
 * @returns The city object returned by the GeoDB cities API
 */
async function getCities(searchValue) {
	//encodeURIComponent serves to avoid string url issues. I found the documentation on it here:
	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent

	const url = `https://${API_HOST}/v1/geo/cities?namePrefix=${encodeURIComponent(
		searchValue
	)}&limit=4&sort=-population`;
	try {
		const response = await fetch(url, {
			//to work with the RapidAPI, both the API KEY and host were necessary to add as headers
			headers: {
				"X-RapidAPI-Key": API_KEY,
				"X-RapidAPI-Host": API_HOST,
			},
		});
		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error("Error fetching cities:", error);
		return null;
	}
}

/**
 * A method to randomly fetch a city object from the GeoDB cities API
 * @returns A city object
 */
async function getRandomCity() {
	const MAX_OFFSET = 10000;
	const randomOffset = Math.floor(Math.random() * MAX_OFFSET);

	const url = `https://${API_HOST}/v1/geo/cities?limit=1&offset=${randomOffset}&sort=-population`;

	try {
		const response = await fetch(url, {
			headers: {
				"X-RapidAPI-Key": API_KEY,
				"X-RapidAPI-Host": API_HOST,
			},
		});

		const data = await response.json();
		return data.data[0];
	} catch (error) {
		console.error("Error fetching random city:", error);
		return null;
	}
}

export { getCities, getRandomCity };
