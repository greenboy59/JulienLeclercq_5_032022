"use strict";

// Récupération de l'order id via URL
const params = new URL(document.location).searchParams;
const orderId = params.get("orderId");

  // Ciblage dans le DOM
const orderIdElement = document.getElementById("orderId");
  
  // Injection dans le DOM
orderIdElement.innerText = orderId;
