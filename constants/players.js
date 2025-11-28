// ! player one
const PLAYER_ONE = {
	name: "Greg",
	totalScore: 0,
	HP: 100,
	stats: {
		resilience: 10,
		exhaustion: 5,
		defense: 10,
	},
	pfp: "./public/house.jpg",

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
};

// ! player two
const PLAYER_TWO = {
	name: "Robert",
	totalScore: 0,
	HP: 100,
	stats: {
		resilience: 25,
		exhaustion: 5,
		defense: 10,
	},
	pfp: "./public/robert.jpg",

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
};

const playersArray = [PLAYER_ONE, PLAYER_TWO];

export { playersArray };
