//Disclaimer for the assignment: all of this JS was written by me.

//Grab the player object from stored memoy
const player = JSON.parse(localStorage.getItem("player"));

// ! Declare game constants
const unitPriceModification = 1;
const materialQuantityModification = 250;
const priceSensitivity = 2.5;
const baseDemand = 5;
const priceBase = 30;
const marketingScale = 1.5;
// ! Grab stuff

const itemCountD = document.querySelector(".item-count");
const fundsD = document.querySelector(".funds");
const unsoldInventoryD = document.querySelector(".unsold-inventory");
const demandD = document.querySelector(".demand");
const unitPriceD = document.querySelector(".unit-price");
const marketingLevelD = document.querySelector(".marketing-level");
const marketingPriceD = document.querySelector(".marketing-price");

const itemsPerSecD = document.querySelector(".items-per-sec");
const remainingMaterialD = document.querySelector(".remaining-material");
const materialPriceD = document.querySelector(".material-price");
const factoryCountD = document.querySelector(".factories");
const factoryPriceD = document.querySelector(".factory-price");
const NPCHateD = document.querySelector(".speech-bubble");
const playerItems = document.querySelector(".player-items");

//! Declare important logic variables
let itemCount = 0;
let funds = 0;
let unsoldInventory = 0;
let demand = 0;
let unitPrice = 30;
let marketingLevel = 1;
let marketingPrice = 1000;
let itemsPerSec = 0;
let remainingMaterial = 1000;
let materialPrice = 150;
let factoryCount = 0;
let factoryPrice = 500;
let factoryInterval;
let galacticDemand = 10;
let salesPerSecond = 0;
let itemsInLastSecond = 0;

let NPCMessage = "";

// ! FUNCTIONS
// ? DISPLAY FUNCTIONS
function displayPlayerStats(player) {
	const playerCard = document.querySelector(".player-card");

	// pfp

	const playerPfp = playerCard.querySelector(".portrait img");

	//i found the documentation on .startswith here: https://www.w3schools.com/jsref/jsref_startswith.asp
	playerPfp.src = player.pfp.startsWith("http")
		? player.pfp
		: "../../" + player.pfp;

	// Name
	const playerName = playerCard.querySelector(".name");
	playerName.textContent = player.name;

	//Stats
	const playerStats = playerCard.querySelector(".stats");
	playerStats.querySelector(".resilience").textContent =
		"Resilience: " + player.stats.resilience;
	playerStats.querySelector(".exhaustion").textContent =
		"Exhaustion: " + player.stats.exhaustion;
	playerStats.querySelector(".defense").textContent =
		"Defense: " + player.stats.defense;
}
function updateBusinessInfo() {
	fundsD.textContent = funds.toFixed(2);
	unsoldInventoryD.textContent = unsoldInventory;
	demandD.textContent = demand.toFixed(0);
	itemsPerSecD.textContent = itemsPerSec;
	unitPriceD.textContent = unitPrice.toFixed(0);
	remainingMaterialD.textContent = remainingMaterial;
	materialPriceD.textContent = materialPrice.toFixed(2);
	factoryCountD.textContent = factoryCount;
	factoryPriceD.textContent = factoryPrice.toFixed(2);
	itemCountD.textContent = itemCount;
	marketingLevelD.textContent = marketingLevel;
	marketingPriceD.textContent = marketingPrice;

	if (factoryCount > 0) {
		playerItems.textContent = `${factoryCount} factories`;
	}
}
function updateNPCMessage() {
	switch (true) {
		case remainingMaterial === 0 && funds < materialPrice:
			NPCMessage = "You've gone bankrupt!!! IDIOT.";
			break;
		case itemCount < 500:
			NPCMessage = "You suck!! Build more spaceships now!!!!";
			break;
		case itemCount < 1000:
			NPCMessage = "You're still way too slow! WORK HARDER.";
			break;
		case itemCount < 2000:
			NPCMessage = "WOW! You've gone from trash to garbage! Keep it up!";
			break;
		case itemCount < 3500:
			NPCMessage = "If your work was a food, it would be plain toast.";
			break;
		case itemCount < 5000:
			NPCMessage = "Did I just catch you having fun?";
			break;
		case itemCount >= 5000:
			NPCMessage =
				"You still haven't earned my validation, but that's game over. decent job, i guess.";
			break;
	}

	NPCHateD.textContent = NPCMessage;
}

// ? CREATION FUNCTIONS
function modifyUnitPrice(change) {
	unitPrice += change;
}

function factoryProduction() {
	if (!factoryInterval) {
		factoryInterval = setInterval(() => {
			if (factoryCount > 0) {
				for (let i = 0; i < factoryCount; i++) {
					if (remainingMaterial > 0) {
						makeShip();
					} else {
						break;
					}
				}
				updateBusinessInfo();
			}
		}, 1000);
		updateBusinessInfo();
	}
}

const makeShip = () => {
	remainingMaterial--;
	unsoldInventory++;
	itemCount++;
	itemsInLastSecond++;

	updateNPCMessage();
};

const makeFactory = () => {
	factoryCount++;
};

const raiseMarketing = () => {
	marketingLevel++;
};

// ? SELLING FUNCTIONS
// ! Game Constants

function calculateDemand() {
	// 1. Calculate the raw effect of marketing
	let marketingMultiplier = marketingLevel * marketingScale;

	// 2. Calculate the price effect (inverse relationship)
	// The exponent (priceSensitivity) softens the impact of price changes.
	// The original UP formula is often simplified to just (BASE_PRICE / unitPrice).
	let priceEffect = Math.pow(priceBase / unitPrice, priceSensitivity);

	// Combining these two
	let rawDemand = marketingMultiplier * priceEffect;

	// 3. Apply a small random variation (e.g., +/- 5%)
	const randomFactor = 1 + (Math.random() * 0.1 - 0.05); // Random between 0.95 and 1.05

	// Update the global demand variable
	demand = rawDemand * randomFactor;
}

function processSales() {
	calculateDemand();
	const marketWillingness = Math.floor(demand);
	const salesCount = Math.min(unsoldInventory, marketWillingness);

	if (salesCount > 0) {
		funds += salesCount * unitPrice;
		unsoldInventory -= salesCount;
		salesPerSecond = salesCount;
	} else {
		salesPerSecond = 0;
	}

	updateBusinessInfo();
}

// ! MAIN GAMEPLAY SECTION
displayPlayerStats(player); //Load the player's info
updateBusinessInfo(); //Update the inital business stats
factoryProduction(); //Start factory production process
setInterval(processSales, 1000); //Start selling loop
setInterval(() => {
	//start tracking items prodcued per second
	itemsPerSec = itemsInLastSecond;
	itemsInLastSecond = 0;
	updateBusinessInfo();
}, 1000);

// ! Add event listeners
const lowerPrice = document.querySelector(".lower-price");
lowerPrice.addEventListener("click", () => {
	modifyUnitPrice(-unitPriceModification);
	updateBusinessInfo();
});

const raisePrice = document.querySelector(".raise-price");
raisePrice.addEventListener("click", () => {
	modifyUnitPrice(unitPriceModification);
	updateBusinessInfo();
});

const createShipButton = document.querySelector(".make-btn");
createShipButton.addEventListener("click", () => {
	if (remainingMaterial > 0) {
		makeShip();
		updateBusinessInfo();
	}
});

const buyMaterialButton = document.querySelector(".buy-material");
buyMaterialButton.addEventListener("click", () => {
	if (funds >= materialPrice) {
		funds -= materialPrice;
		remainingMaterial += materialQuantityModification;
		updateBusinessInfo();
	}
});

const buyFactoryButton = document.querySelector(".buy-factory");
buyFactoryButton.addEventListener("click", () => {
	if (funds >= factoryPrice) {
		funds -= factoryPrice;
		makeFactory();
		factoryPrice *= 1.5; //Make future factories more expensive
		updateBusinessInfo();
	}
});

const raiseMarketingButton = document.querySelector(".marketing");
raiseMarketingButton.addEventListener("click", () => {
	if (funds >= marketingPrice) {
		funds -= marketingPrice;
		raiseMarketing();
		marketingPrice *= 2; //Make future marketing upgrades more expensive
		updateBusinessInfo();
	}
});
