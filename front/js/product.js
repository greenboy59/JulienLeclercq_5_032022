"use strict";
// Création des variables

// Variables de ciblage du DOM
const image = document.querySelector(".item__img");
const title = document.querySelector("#title");
const price = document.querySelector("#price");
const description = document.querySelector("#description");
const colorSelectElement = document.querySelector("#colors");
const quantitySelectElement = document.querySelector("#quantity");
const addToCartButton = document.querySelector("#addToCart");
const deleteButtonSelectElement = document.querySelector(".item__content__addButton");

// Récupération de l'id sur le produit séléctionné en page d'accueil via params
const params = new URL(document.location).searchParams;
const id = params.get("id");

// Création des fonctions

// Pour récupérer des infos du local storage
/**
 * @param key {string}
 * @returns {any}
 */
function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

// Pour envoyer des données vers le local storage
/**
 * @param key {string}
 * @param item {any}
 * @returns {any}
 */
function saveToLocalStorage(key, item) {
  localStorage.setItem(key, JSON.stringify(item));
}

// Affichage du produit séléctionné en amont sur la page d'accueil
function displayProduct(product) {
  image.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
  title.innerHTML = `<h1>${product.name}</h1>`;
  price.innerHTML = `<p>${product.price}</p>`;
  description.innerHTML = `<p>${product.description}</p>`;
  product.colors.forEach((color) => (colorSelectElement.innerHTML += `<option value="${color}">${color}</option>`),);
}

// Fonction pour Sauvegarder le produit dans le local storage et mettre à jour la quantité
function saveProduct() {
  // Récupération des données du local storage insérées dans variable 'cart'
  let cart = getFromLocalStorage("cart");

  // Si la clé 'cart' n'éxiste pas dans le local storage, on créé un tableau 'cart' vide
  if (!cart) {
    cart = [];
  }

  // Si le même produit/couleur est déjà dans le panier, on mets à jour la quantité
  let productAlreadyInCart = cart.find((item) => item.id === id && item.color === colorSelectElement.value);
  if (productAlreadyInCart) {
      let newQuantity = Number(quantitySelectElement.value) + Number(productAlreadyInCart.quantity);
      productAlreadyInCart.quantity = newQuantity.toString();
  } else {
    cart.push({
      id,
      color: colorSelectElement.value,
      quantity: quantitySelectElement.value,
    });
  }
  saveToLocalStorage("cart", cart);
}

// Création d'une fenêtre popup pour les ajouts de produits au panier

// Règles CSS génériques pour la pop-up
function defineCss(color) {
  const popUpElement = document.getElementById("popUpElement");
  popUpElement.style.background = color;
  popUpElement.style.textAlign = "center";
  popUpElement.style.marginTop = "20px";
  popUpElement.style.fontWeight = "bold";
  popUpElement.style.borderRadius = "15px";
}

 // Fenêtre pop-up de confirmation
function displayConfirmationPopUp() {
  // Condition vérifiant si une pop-up est déjà présente afin d'éviter une répétition à l'infini 
  if (!document.getElementById("popUpElement")) {
    // Affichage popup "article ajouté au panier"
    deleteButtonSelectElement.insertAdjacentHTML("afterend", `<div id="popUpElement"><p>Le produit ${title.textContent} à bien été ajouté au panier</p></div>`);
    defineCss("#2d3e50")

    // setTimeout ferme la pop-up au bout de 2s
    setTimeout(closePopUp, 1500);
  }
}

// Fenêtre pop-up d'erreur
function displayErrorPopUp() {
  // Condition vérifiant si une pop-up est déjà présente afin d'éviter une répétition à l'infini
  if (!document.getElementById("popUpElement")) {
    // Affichage popup error
    deleteButtonSelectElement.insertAdjacentHTML("afterend", `<div id="popUpElement"><p>Vous devez séléctionner une couleur ET une quantité positive</p></div>`);
    defineCss("red");

    // setTimeout ferme la pop-up au bout de 2s
    setTimeout(closePopUp, 1500);
  }
}

// Fonction fermant la fenêtre pop-up en supprimant la div html afin d'éviter les répétitions dans le html si l'utilisateur clic plusieurs fois sur le bouton
function closePopUp() {
    popUpElement.remove();
}

// Au clic sur le bouton 'ajouter au panier', éxecuter la fonction 'saveProduct'
function onClickAddToCart() {
  if (colorSelectElement.value && quantitySelectElement.value > 0) {
    saveProduct();
    displayConfirmationPopUp();
  } else {
    displayErrorPopUp();
  }
}

addToCartButton.addEventListener("click", onClickAddToCart);

// Récupération des données de l'API
fetch(`http://localhost:3000/api/products/${id}`)
  .then((response) => response.json())
  .then((product) => {
    displayProduct(product);
  })
  .catch((err) => console.error(err));