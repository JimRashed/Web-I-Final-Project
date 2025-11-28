//in my definition, the "strongest" player is the one with the most resilinece

function sortPlayers(players) {
	return players.sort(
		(playerA, playerB) => playerB.stats.resilience - playerA.stats.resilience
	);
}
export { sortPlayers };
