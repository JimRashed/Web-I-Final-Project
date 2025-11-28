import { playersArray } from "../../constants/players.js";
//Grab the player object from stored memoy
const player1Data = JSON.parse(localStorage.getItem("player"));

// NOTE: Since the original players object have methods, but JSON apparently doesn't transfer methods, i'll need to
//recreate the player object from the new player data and the methods. The only way i've found to do this is object.assign, for
//which i found the documentation here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

const PLAYER_ONE = Object.assign(player1Data, {
	LoseHealth(attack) {
		//Ensure damage dealt is always at least 1 (or else the game kind of sucks)
		this.HP -=
			Math.max(1, attack * this.stats.exhaustion - this.stats.defense) /
			this.stats.resilience;
		return this.HP;
	},
	GainHealth(healing) {
		this.HP += (healing / this.stats.exhaustion) * this.stats.resilience;
		return this.HP;
	},
	UpdateScore(points) {
		this.totalScore += points;
		return this.totalScore;
	},
});

const PLAYER_TWO = playersArray[0];
const BAKE_CONSTANT = 2;
const SMACK_CONSTANT = 10;
const CONSUME_CONSTANT = 2;
const MAX_HEALTH = 100;
const MIN_SCORE_TO_WIN = 10;

// ! Functions
function displayStats(player) {
	const playerCard =
		player === PLAYER_ONE
			? document.querySelector("#player1")
			: document.querySelector("#player2");
	// Name
	const playerName = playerCard.querySelector(".player-name");
	playerName.textContent = player.name;

	// pfp
	const playerPfp = playerCard.querySelector(".pfp");

	//player one is loaded dynamically, while player 2 is in players.js
	playerPfp.src = player === PLAYER_ONE ? player.pfp : "../../" + player.pfp;

	// Cookies/Score
	const playerCookies = playerCard.querySelector(".cookies");
	playerCookies.textContent = player.totalScore + " cookies";

	// Health bar
	const greenBar = playerCard.querySelector(".green");
	const redBar = playerCard.querySelector(".red");

	greenBar.style.flex = player.HP;
	redBar.style.flex = MAX_HEALTH - player.HP;
}

function bake(player) {
	player.UpdateScore(BAKE_CONSTANT);
}

function smack(player) {
	player.LoseHealth(SMACK_CONSTANT);
}

function consume(player) {
	if (player.totalScore !== 0) {
		player.GainHealth(CONSUME_CONSTANT);
		if (player.HP > MAX_HEALTH) player.HP = MAX_HEALTH;
		player.UpdateScore(-CONSUME_CONSTANT);
	}
}
function isGameOver(player1, player2) {
	if (player1.HP <= 0) {
		identifyWinner(player2, player1);
		return true;
	}
	if (player2.HP <= 0) {
		identifyWinner(player1, player2);
		return true;
	}

	//Ensure a minimum threshold of cookies to win (or else first one to click wins. that would suck.)
	if (
		player1.totalScore >= MIN_SCORE_TO_WIN ||
		player2.totalScore >= MIN_SCORE_TO_WIN
	) {
		if (player1.totalScore >= 3 * player2.totalScore) {
			identifyWinner(player1, player2);
		} else if (player2.totalScore >= 3 * player1.totalScore) {
			identifyWinner(player2, player1);
		}
	}

	return false;
}
function identifyWinner(winner, loser) {
	//find dom element of the winner
	const winnerCard =
		winner === PLAYER_ONE
			? document.querySelector("#player1")
			: document.querySelector("#player2");

	//find dom element of the loser
	const loserCard =
		loser === PLAYER_ONE
			? document.querySelector("#player1")
			: document.querySelector("#player2");

	winnerCard.classList.add("winner");
	loserCard.classList.add("loser");

	// buttons are disabled upon game over (so no sneaky business happens)
	const buttons = document.querySelectorAll("button");
	buttons.forEach((btn) => (btn.disabled = true));
}

// Update player info on page load
displayStats(PLAYER_ONE);
displayStats(PLAYER_TWO);

// ! Event listeners

// * Player 1 buttons
const player1Bake = document.querySelector("#p1-bake");
player1Bake.addEventListener("click", () => {
	bake(PLAYER_ONE);
	displayStats(PLAYER_ONE);
	isGameOver(PLAYER_ONE, PLAYER_TWO);
});

const player1Smack = document.querySelector("#p1-smack");
player1Smack.addEventListener("click", () => {
	smack(PLAYER_TWO);
	displayStats(PLAYER_TWO);
	isGameOver(PLAYER_ONE, PLAYER_TWO);
});

const player1Consume = document.querySelector("#p1-consume");
player1Consume.addEventListener("click", () => {
	consume(PLAYER_ONE);
	displayStats(PLAYER_ONE);
	isGameOver(PLAYER_ONE, PLAYER_TWO);
});

// * Player 2 buttons
const player2Bake = document.querySelector("#p2-bake");
player2Bake.addEventListener("click", () => {
	bake(PLAYER_TWO);
	displayStats(PLAYER_TWO);
	isGameOver(PLAYER_ONE, PLAYER_TWO);
});

const player2Smack = document.querySelector("#p2-smack");
player2Smack.addEventListener("click", () => {
	smack(PLAYER_ONE);
	displayStats(PLAYER_ONE);
	isGameOver(PLAYER_ONE, PLAYER_TWO);
});

const player2Consume = document.querySelector("#p2-consume");
player2Consume.addEventListener("click", () => {
	consume(PLAYER_TWO);
	displayStats(PLAYER_TWO);
	isGameOver(PLAYER_ONE, PLAYER_TWO);
});
