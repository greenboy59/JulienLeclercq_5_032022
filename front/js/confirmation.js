"use strict";

// Récupération de l'order id via url searchParams puis affichage de celui-ci sur la page
const params = new URL(document.location).searchParams;
const orderId = params.get("orderId");

const orderIdElement = document.getElementById("orderId");
  
orderIdElement.innerText = orderId;
