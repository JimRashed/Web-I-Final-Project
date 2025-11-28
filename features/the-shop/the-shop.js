//AI was not used for the JavaScript

"use strict";

//Fetch the actual shop items
import { ITEMS } from "../../constants/items.js";

// ! Item creation

ITEMS.forEach((item) => {
	//Create the item card (container)
	const itemCard = $("<div>").addClass("item-card");

	//Create the image
	const img = $("<img>")
		.attr("data-src", item.image)
		.addClass("shopItem")
		.attr("alt", `Picture of item ${item.id}`);

	//Create the text stuff of the element
	const title = $("<h1>").addClass("item-title").text(item.title);
	const desc = $("<p>").addClass("item-desc").text(item.description);
	const price = $("<p>")
		.addClass("item-price")
		.text("$" + item.price.toFixed(2));

	//Create the other stuff (rating and purchase)
	const rating = $("<p>").addClass("rating").text(`${item.rating.rate}/5`);
	const reviewCount = $("<p>")
		.addClass("reviewCount")
		.text(`(${item.rating.count} reviews)`);
	const button = $("<button>").addClass("purchase").text("Purchase");

	//Append the content to its corresonding third of the card
	const cardLeft = $("<div>");
	cardLeft.append(title, desc);
	const cardMiddle = $("<div>");
	cardMiddle.append(img);
	const cardRight = $("<div>");
	cardRight.append(price, rating, reviewCount, button);

	itemCard.append(cardLeft, cardMiddle, cardRight);

	//Append the card to the body
	$("body").append(itemCard);
});

// ! Item loading
// * Fetch all the items
const cards = $(".item-card");

//* Make an options to control the API
const options = {
	threshold: [0, 0.25, 0.75, 1],
};

// * Create an Intersection Observer
const observer = new IntersectionObserver((entries, observer) => {
	// * Make Callback
	entries.forEach((entry) => {
		//identify the stuff to load
		const card = $(entry.target);
		const cardImage = card.find("img");
		const cardText = card.find("h1, p, button");

		//Load image directly on intersection
		if (entry.isIntersecting) {
			const dataSrc = cardImage.data("src");
			cardImage.attr("src", dataSrc).addClass("loaded");
		}

		// load a card text if it is 1/4 intersecting or more
		if (entry.intersectionRatio >= 0.25) {
			cardText.addClass("visible");
		}
		// load it out otherwise
		else {
			cardText.removeClass("visible");
		}
	});
}, options);

// * Tell the observer to observe
cards.each(function () {
	observer.observe(this);
});
