"use strict";

// Déclaration des variables
const cartItemsElement = document.querySelector("#cart__items");
const totalPriceElement = document.querySelector("#totalPrice");
const totalQuantityElement = document.querySelector("#totalQuantity");

let cart = JSON.parse(localStorage.getItem("cart"));
const url = `http://localhost:3000/api/products`;

/**
 * @param key {string}
 * @param item {any}
 * @returns {any}
 */
function saveToLocalStorage(key, item) {
  localStorage.setItem(key, JSON.stringify(item));
}

// Injection dans le DOM
function displayCart(products) {
  cart.forEach((item) => {
    const product = products.find((product) => item.id === product._id);
    cartItemsElement.innerHTML += `<article class="cart__item" data-id="${item.id}" data-color="${item.color}">
          <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="Photographie d'un canapé">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${product.name}</h2>
              <p>${item.color}</p>
              <p><span class="item__price">${product.price}</span> €</p>
          </div>
          <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
              <label>Qté:</label>
              <p> </p>
              <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
            </div>
            <div class="cart__item__content__settings__delete">
              <p class="deleteItem">Supprimer</p>
            </div>
          </div>
        </div>
      </article>`;
  });
}

// Calcul du montant et quantité totale pour l'afficher sur la page
function calculateCartAmount() {
  let cartSum = 0;
  let totalQuantity = 0;
  const cartHtmlElements = document.querySelectorAll(".cart__item");
  cartHtmlElements.forEach((element) => {
    const price = element.querySelector("span.item__price").textContent;
    const quantity = element.querySelector("input.itemQuantity").value;
    cartSum += parseInt(price) * parseInt(quantity);
    totalQuantity += parseInt(quantity);
  })
  totalQuantityElement.textContent = totalQuantity;
  totalPriceElement.textContent = cartSum;
}

// Modifier la quantité d'un produit directement dans le panier via l'input itemQuantity
function modifyCartQuantity() {
  // Cibler dans le DOM les éléments reliés aux input 
    document.querySelectorAll("article").forEach((itemSelected) => {

      // Récupération des data-id et data-color des produits à modifier
      itemSelected.addEventListener("change", (event) => {
        let idSelectElement = itemSelected.dataset.id;
        let colorSelectElement = itemSelected.dataset.color;

        // Mettre en corélation les data du DOM et les éléments dans le panier
        let productAlreadyInCart = cart.find((product) => product.id === idSelectElement && product.color === colorSelectElement,);

        // Si le produit est déjà dans le panier, alors on mets à jour la quantité
        if (productAlreadyInCart) {
          productAlreadyInCart.quantity = event.target.value;
          saveToLocalStorage("cart", cart);
        }
      });
    });
}

// Supprimer un produit en cas de click sur le bouton 'supprimer'
function deleteCartItem() {
  // Ciblage des boutons 'supprimer' dans le DOM
  document.querySelectorAll(".deleteItem").forEach((deleteButton, index)=> {

  // Parcours des boutons puis ajout d'un écouteur d'événement 
    deleteButton.addEventListener('click', () => {

      // Séléction des items dans le panier portant le même index que le produit séléctionné
      let idToDelete = cart[index].id;
      let colorToDelete = cart[index].color;

      // Application d'une méthode filter afin de supprimer le produit concerné par le bouton 'supprimer'
      cart = cart.filter((product) => product.id !== idToDelete && product.coulor !== colorToDelete,);

      // Mise à jour du local storage
      saveToLocalStorage("cart", cart)

      //Alerte produit supprimé et reload de la page
      alert("Ce produit a bien été supprimé de votre panier");
      location.reload();
    });
  })
}

// ************** VALIDATION EMAIL **************

// 1. Récupérer et analyser les données saisies par l’utilisateur dans le formulaire (Attention à bien vérifier les données saisies par l’utilisateur.)

// 2. Afficher un message d’erreur si besoin (par exemple lorsqu’un utilisateur renseigne “bonjour” dans le champ “e-mail”) (Lors de la vérification des données via des regex, attention à bien mener des tests pour vérifier le bon fonctionnement des regex.)

// 3. Constituer un objet contact (à partir des données du formulaire) et un tableau de produits

let formArray = [];

// Mise en place des Regex
let regEmail = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$", "g");
let regName = new RegExp("^[a-zA-Zà-ùÀ-Ù- -]+$", "g");
let regAdress = new RegExp("^[A-Za-z0-9'.-s,]+$", "g");

// Ciblage dans le DOM
let emailSelectElement = document.querySelector('input[name="email"]');
let firstNameSelectElement = document.querySelector('input[name="firstName"]');
let lastNameSelectElement = document.querySelector('input[name="lastName"]');
let adressSelectElement = document.querySelector('input[name="address"]');
let citySelectElement = document.querySelector('input[name="city"]');
let cartOrderForm = document.querySelector('.cart__order');

// // Vérification du Prénom
// function validName() {
  
//   // Mise en place de l'écouteur d'événement sur l'input email
//   firstNameSelectElement.addEventListener("change", function (event) {
//     lastNameSelectElement.addEventListener("change", function (event) {
//       // Récupération de la balise 'emailErrorMsg'
//       let firstNameErrorMsg = firstNameSelectElement.nextElementSibling;
//       let lastNameErrorMsg = lastNameSelectElement.nextElementSibling;

//       // Test de l'expression régulière et affichage du message correspondant si true ou false
//       if (regName.test(event.target.value)) {
//         firstNameErrorMsg.innerHTML = "Valide";
//         lastNameErrorMsg.innerHTML = "Valide";
//         return true;
//       } else {
//         firstNameErrorMsg.innerHTML = "INVALIDE";
//         lastNameErrorMsg.innerHTML = "INVALIDE";
//         return false;
//       }
//     });
//   });
// };
// validName();

// Vérification de l'email saisi
function validEmail() {
  
  // Mise en place de l'écouteur d'événement sur l'input email
  emailSelectElement.addEventListener("change", function (event) {

    // Récupération de la balise 'emailErrorMsg'
    let emailErrorMsg = emailSelectElement.nextElementSibling;

    // Test de l'expression régulière et affichage du message correspondant si true ou false
    if (regEmail.test(event.target.value)) {
      emailErrorMsg.innerHTML = "L'adresse email EST valide";
      return true;
    } else {
      emailErrorMsg.innerHTML = "L'adresse email n'est PAS valide";
      return false;
    }
  });
};
validEmail();

// ************** VALIDATION DU FORMULAIRE **************

cartOrderForm.addEventListener("submit", function (event) {
  // Stopper le comportement par défaut afin de mettre une condition de validation des input avant envoi vers page 'confirmation'
  event.preventDefault();
  // if (validEmail(emailSelectElement) && // mettre ici les autres validations quand elles seront écrites ){
  //   cartOrderForm.submit();
  // }
});




// Récupération des données de l'API
fetch(url)
  .then((response) => response.json())
  .then((products) => {
    displayCart(products);
    calculateCartAmount();
    modifyCartQuantity();
    deleteCartItem();
  })
  .catch((err) => console.error(err));
