"use strict";

//fetch stored city item
const city = JSON.parse(localStorage.getItem("selectedCity"));

const populationP = document.querySelector("#population");
const coordinatesP = document.querySelector("#coordinates");
const weatherP = document.querySelector("#weather");
const flagImage = document.querySelector(".country img");
