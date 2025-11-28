"use strict";

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
