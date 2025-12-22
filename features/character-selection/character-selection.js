import { fetchCharacter } from "../../services/character-api.js";
import { sortPlayers } from "../../utils/character-sorters.js";

// ! Grabbing stuff

//Grabbing the form
const form = document.querySelector("form");

//Grabbing the error section
const error = document.querySelector(".error");

// ! Functions

//? NEW DISPLAY METHOD
/**
 * A method to obtain html content of a single character's card
 * @param {*} character a player object
 * @param {*} id that player's unique id
 * @returns the html content of that character's card
 */
function renderCharacter(character, id) {
	return `
    <div class="card" id="${character.id}">
	  <img src="${character.pfp}" alt="character pfp">
      <h2>${character.name}</h2>
      <p class="resilience">Resilience: ${character.stats.resilience}</p>
	   <p class="defense">Defense: ${character.stats.defense}</p>
	    <p class="exhaustion">Exhaustion: ${character.stats.exhaustion}</p>
    </div>
  `;
}

/**
 * A method to render all character options onto the screen
 * @param {*} characters The array of all characters to load in the page
 */
function renderPage(characters) {
	characters.forEach((character) => {
		console.log(character);
		const html = renderCharacter(character);
		$(".fighters").append(html);
	});

	//add card event listeners once the dynamic characters are all loaded
	addCardListeners();
}

//chatGPT code -- approved by you in class
/**
 * A method to fetch and format all the characters from the API
 * @returns an array of formatted characters
 */
async function getCharacters() {
	const pokemonToFetch = [
		"charizard",
		"bulbasaur",
		"squirtle",
		"lucario",
		"rayquaza",
	];
	const characters = [];

	for (const pok of pokemonToFetch) {
		const raw = await fetchCharacter(pok); // waits properly
		const mapped = mapPokemon(raw); // maps properly
		characters.push(mapped);
	}

	return characters;
}

/**
 * The method to map each pokemon to a usable player object
 * @param {*} unformattedPokemon the JSON parsed object obtained from the Pokemon API
 * @returns the same object formatted to be in a compatible format with all minigames
 */
function mapPokemon(unformattedPokemon) {
	return {
		id: parseInt(unformattedPokemon.id),
		name: `${unformattedPokemon.name}`,
		totalScore: 0,
		HP: 100,

		stats: {
			resilience: parseInt(unformattedPokemon.stats[0].base_stat),
			exhaustion: Math.max(unformattedPokemon.weight / 10, 50),
			defense: parseInt(unformattedPokemon.id),
		},
		pfp: `${unformattedPokemon.sprites.front_default}`,
	};
}

/**
 * A function to validate a guest player's input fields before submission
 * @returns an error message if something invalid happens, nothing otherwise
 */
function validateGuestData() {
	const guestPFP = document.querySelector("#guest-pfp").value;
	const guestName = document.querySelector("#guest-name").value;
	const guestAge = document.querySelector("#guest-age").value;
	const guestResilience = document.querySelector("#guest-resilience").value;
	const guestExhaustion = document.querySelector("#guest-exhaustion").value;
	const guestDefense = document.querySelector("#guest-defense").value;

	switch (true) {
		case guestPFP === "" ||
			guestName === "" ||
			guestAge === "" ||
			guestResilience === "" ||
			guestExhaustion === "" ||
			guestDefense === "":
			return "All guest profile fields must be filled in.";

		case guestAge < 16:
			return "This game is rated 16+.";
		case guestAge > 125:
			return "Your guest must be of a human age.";
		case guestResilience < 0 || guestDefense < 0 || guestExhaustion < 0:
			return "Player stats cannot be negative!";
		default:
			break;
	}

	return createGuestObject(
		guestPFP,
		guestName,
		guestAge,
		guestResilience,
		guestExhaustion,
		guestDefense
	);
}

/**
 * A function to create a guest player object from inputted data
 * @param {*} guestPFP The URL to the guest's profile picture image
 * @param {*} guestName The guest player's name
 * @param {*} guestAge The guest player's age
 * @param {*} guestResilience The guest player's resilience stat
 * @param {*} guestExhaustion The guest player's exhaustion stat
 * @param {*} guestDefense The guest player's defense stat
 * @returns
 */
function createGuestObject(
	guestPFP,
	guestName,
	guestAge,
	guestResilience,
	guestExhaustion,
	guestDefense
) {
	const guest = {
		name: guestName,
		age: guestAge,
		stats: {
			resilience: guestResilience,
			exhaustion: guestExhaustion,
			defense: guestDefense,
		},
		pfp: guestPFP,
	};
	return guest;
}
/**
 * A function to add event listeners to player cards for selection. Made into a function to control time of verification (AFTER player loading)
 */
function addCardListeners() {
	const cards = document.querySelectorAll(".card");
	cards.forEach((card) => {
		card.addEventListener("click", () => {
			//card variable already taken :(
			//remove all chosen cards
			cards.forEach((crd) => crd.classList.remove("chosen"));
			//make this card chosen
			card.classList.add("chosen");

			// ! guest
			if (card.id === "guest") {
				chosenPlayer = "guest";
				chosenPlayerIndex = -1;
				return;
			}

			//! POKEMON

			//get that card's id
			const clickedCardID = parseInt(card.id);
			//find the player with the corresponding id
			//documentation for array.findIndex() found here: https://www.w3schools.com/jsref/jsref_findindex.asp
			const selectedPlayerIndex = players.findIndex(
				(crd) => crd.id === clickedCardID
			);

			//change global variables
			chosenPlayerIndex = selectedPlayerIndex;
			chosenPlayer = "pokemon";
			//donesy dundy
		});
	});
}

let players = [];
players = await getCharacters();
//sort players
const sortedPlayers = sortPlayers(players);
renderPage(sortedPlayers);

//set the default values
let chosenPlayer = "unchosen";
let chosenPlayerIndex = -1;

// ! Add event listeners

//Valdation and sending
form.addEventListener("submit", (event) => {
	event.preventDefault();
	if (chosenPlayer === "unchosen") {
		error.textContent = "You must select a player.";
		return;
	}
	if (chosenPlayer === "guest") {
		const guestReturn = validateGuestData();
		if (typeof guestReturn === "string") {
			error.textContent = guestReturn;
			return;
		}
		// Save guest to local storage
		localStorage.setItem("player", JSON.stringify(guestReturn));
	} else {
		//record in storage
		localStorage.setItem("player", JSON.stringify(players[chosenPlayerIndex]));
	}
	window.location.href = "../main-menu/main-menu.html";
});
