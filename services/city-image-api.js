"use strict";

//TODO - ADD API KEY
const API_KEY = "OPZOuHwFEyt1tIDEQJrg3htW2gecYqPZ1zbYWXFLw6YvN7uPMlUVjQSc";
/**
 * The asynchronous function to fetch the src attribute of the first result of the
 * search of the city name on the pexels api
 * @param {*} cityName
 * @returns
 */
async function getImageSrc(cityName) {
	const url = `https://api.pexels.com/v1/search?query=${cityName}&per_page=1&orientation=landscape`;
	try {
		const response = await fetch(url, {
			headers: {
				Authorization: API_KEY,
			},
		});
		const data = await response.json();

		if (data.photos && data.photos.length > 0) return data.photos[0].src;
		else {
			console.error(`No Pexels images found for search ${cityName}`);
			return null;
		}
	} catch (error) {
		console.error("Error fetching cities:", error);
		return null;
	}
}

export { getImageSrc };
