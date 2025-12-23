"use strict";

/**
 * An asynchronous function that calls the Open Meteo API to get the weather at a specfic location
 * @param {*} latitude The latitude coordinate of the desired location
 * @param {*} longitude The longitude coordinate of the desired location
 * @returns The weather object returned by the Open Meteo API
 */
async function getWeather(latitude, longitude) {
	const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
	try {
		const response = await fetch(url);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching weather:", error);
		return null;
	}
}

export { getWeather };
