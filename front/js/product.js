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

// Récupération de l'id sur le produit séléctionné en page d'accueil via params
const params = new URL(document.location).searchParams;
const id = params.get("id");

// Création des fonctions

/**
 * @param key {string}
 * @returns {any}
 */
function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

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
  product.colors.forEach(
    (color) =>
      (colorSelectElement.innerHTML += `<option value="${color}">${color}</option>`),
  );
}

// Affichage d'un message d'erreur en cas de mauvaise séléction
function checkProductSelection() {
  if (colorSelectElement.value === "" || quantitySelectElement.value <= 0) {
    alert("Vous devez séléctionner une couleur ET une quantité");
    return false;
  }
  return true;
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
  let productAlreadyInCart = cart.find((item) => item.id === id && item.color === colorSelectElement.value,);
  if ("cart" in localStorage && productAlreadyInCart) {
    if (productAlreadyInCart != undefined) {
      console.log("Article déjà au panier");
      let newQuantity = Number(quantitySelectElement.value) + Number(productAlreadyInCart.quantity);
      productAlreadyInCart.quantity = newQuantity.toString();
    }
  } else {
    cart.push({
      id,
      color: colorSelectElement.value,
      quantity: quantitySelectElement.value,
    });
  }

  saveToLocalStorage("cart", cart);
}

// Au clic sur le bouton 'ajouter au panier', éxecuter la fonction 'saveProduct'
function onClickAddToCart() {
  if (checkProductSelection()) {
    saveProduct();
    // Alerte produit ajouté
    alert("Ce produit à bien été ajouté au panier");
  }
}

addToCartButton.addEventListener("click", onClickAddToCart);

// Récupération des données de l'API
 fetch(`http://localhost:3000/api/products/${id}`)
  .then((response) => response.json())
  .then((product) => displayProduct(product))
  .catch((err) => console.error(err))