"use strict";

/**
 * An asynchronous function to fetch a character from the pokemon api by name
 * @param {*} name The name of the desired pokemon character
 * @returns The object of the pokemon API response
 */
async function fetchCharacter(name) {
	try {
		//Receive raw JSON from API
		const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

		//Parse data from JSON
		const pokemon = await response.json();

		//return pokemon
		return pokemon;
	} catch (error) {
		console.error(error);
	}
}

export { fetchCharacter };
