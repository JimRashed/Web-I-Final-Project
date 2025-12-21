"use strict";

/**
 * The asynchronous function to fetch the current weather at a location from the OpenWeather API
 * @param {*} userInput
 * @returns
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
