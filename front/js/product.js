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
  product.colors.forEach((color) => (colorSelectElement.innerHTML += `<option value="${color}">${color}</option>`),);
}

// Création d'une fenêtre popup pour les ajouts de produits au panier

 //fenêtre pop-up
function displayPopUpConfirmation() {
  // Variable testant si les inputs sont vides
  const inputsEmpty = colorSelectElement.value === "" || quantitySelectElement.value <= 0;
  let htmlContent = `<div id="popUpConfirmation"><p>Le produit ${title.textContent} à bien été ajouté au panier</p></div>`;
  if (inputsEmpty) {
    htmlContent = `<div id="popUpConfirmation"><p>Vous devez séléctionner une couleur ET une quantité</p></div>`;
  }
  // Insertion dans le DOM de la fenêtre pop-up à la fin de la div "item__content__settings"
  deleteButtonSelectElement.insertAdjacentHTML("afterend", htmlContent);
  const popUpConfirmationElement = document.getElementById("popUpConfirmation");
  // CSS afin de styliser la fenêtre pop-up
  popUpConfirmationElement.style.textAlign = "center";
  popUpConfirmationElement.style.padding = "15px";
  popUpConfirmationElement.style.marginTop = "15px";
  popUpConfirmationElement.style.fontWeight = "bold";
  popUpConfirmationElement.style.background = "#2d3e50";
  popUpConfirmationElement.style.borderRadius = "15px";
  if (inputsEmpty) {
    popUpConfirmationElement.style.background = "red";
  }
  // setTimeout afin de fermer automatiquement le pop-up au bout de 2s
  setTimeout(closePopUp, 2000);
}

// Fonction fermant la fenêtre pop-up en supprimant la div html afin d'éviter les répétitions dans le html si l'utilisateur clic plusieurs fois sur le bouton
function closePopUp() {
  const popUpConfirmationElement = document.querySelector("#popUpConfirmation");
   popUpConfirmationElement.remove();
}

// Test du remplissage des inputs
function checkProductSelection() {
  if (colorSelectElement.value === "" || quantitySelectElement.value <= 0) {
    return false;
  } return true;
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
    displayPopUpConfirmation();
  } else {
    displayPopUpConfirmation();
  }
}

addToCartButton.addEventListener("click", onClickAddToCart);

// Récupération des données de l'API
fetch(`http://localhost:3000/api/products/${id}`)
  .then((response) => response.json())
  .then((product) => {
    displayProduct(product);
    checkProductSelection();
  })
  .catch((err) => console.error(err));
  